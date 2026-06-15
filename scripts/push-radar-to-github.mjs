import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const filePath = path.join(rootDir, "competitor-radar", "data.json");

const owner = process.env.GITHUB_OWNER ?? "qlb708";
const repo = process.env.GITHUB_REPO ?? "08";
const branch = process.env.GITHUB_BRANCH ?? "main";
const token = process.env.GITHUB_TOKEN;
const targetPath = process.env.GITHUB_CONTENT_PATH ?? "competitor-radar/data.json";

if (!token) {
  throw new Error("Missing GITHUB_TOKEN environment variable.");
}

const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`;
const content = await readFile(filePath, "utf8");
const base64Content = Buffer.from(content, "utf8").toString("base64");

const current = await fetch(endpoint, {
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  }
});

let sha;

if (current.ok) {
  const existing = await current.json();
  sha = existing.sha;
} else if (current.status !== 404) {
  throw new Error(`Failed to fetch existing file: ${current.status} ${current.statusText}`);
}

const updateResponse = await fetch(endpoint, {
  method: "PUT",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28"
  },
  body: JSON.stringify({
    message: `chore: refresh competitor radar data (${new Date().toISOString()})`,
    content: base64Content,
    branch,
    sha
  })
});

if (!updateResponse.ok) {
  const details = await updateResponse.text();
  throw new Error(`GitHub push failed: ${updateResponse.status} ${details}`);
}

const result = await updateResponse.json();
console.log(`Pushed ${targetPath} to ${result.commit?.html_url ?? `${owner}/${repo}`}`);
