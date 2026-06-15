import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const docsDir = path.join(rootDir, "docs");

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });
await cp(distDir, docsDir, { recursive: true });
await writeFile(path.join(docsDir, ".nojekyll"), "\n", "utf8");

console.log(`Prepared GitHub Pages docs directory at ${docsDir}`);
