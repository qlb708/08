import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const owner = process.env.GITHUB_OWNER ?? "qlb708";
const repo = process.env.GITHUB_REPO ?? "08";
const branch = process.env.GITHUB_BRANCH ?? "main";
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("Missing GITHUB_TOKEN environment variable.");
}

const includeRoots = [
  "competitor-radar",
  "docs",
  "public",
  "scripts",
  "src",
  ".env.example",
  "README.md",
  "index.html",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "vite.config.js"
];

const textExtensions = new Set([
  ".css",
  ".example",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".txt",
  ".vue",
  ".yaml",
  ".yml"
]);

async function walk(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const info = await stat(absolutePath);

  if (info.isDirectory()) {
    const entries = await readdir(absolutePath);
    const nested = await Promise.all(entries.sort().map((entry) => walk(path.join(relativePath, entry))));
    return nested.flat();
  }

  return [relativePath];
}

function toRepoPath(relativePath) {
  return relativePath.split(path.sep).join("/");
}

async function getSha(repoPath) {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${repoPath}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return payload.sha;
}

async function uploadFile(relativePath) {
  const repoPath = toRepoPath(relativePath);
  const absolutePath = path.join(rootDir, relativePath);
  const extension = path.extname(relativePath);
  const encoding = textExtensions.has(extension) || path.basename(relativePath).startsWith(".")
    ? "utf8"
    : undefined;
  const content = await readFile(absolutePath, encoding);
  const base64Content = Buffer.from(content, encoding ?? undefined).toString("base64");
  const sha = await getSha(repoPath);

  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      message: `feat: publish interactive competitor radar (${repoPath})`,
      content: base64Content,
      branch,
      sha
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to upload ${repoPath}: ${response.status} ${details}`);
  }

  return repoPath;
}

const files = (await Promise.all(includeRoots.map((entry) => walk(entry)))).flat();

for (const file of files) {
  const uploaded = await uploadFile(file);
  console.log(`Uploaded ${uploaded}`);
}

console.log(`Published ${files.length} files to ${owner}/${repo}@${branch}`);
