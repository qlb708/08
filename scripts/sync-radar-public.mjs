import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "competitor-radar", "data.json");
const targetPath = path.join(rootDir, "public", "competitor-radar", "data.json");

const content = await readFile(sourcePath, "utf8");
await mkdir(path.dirname(targetPath), { recursive: true });
await writeFile(targetPath, content, "utf8");

console.log(`Synced ${sourcePath} -> ${targetPath}`);
