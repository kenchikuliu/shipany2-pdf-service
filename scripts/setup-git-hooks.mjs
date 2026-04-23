import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const gitDir = path.join(projectRoot, ".git");

if (!existsSync(gitDir)) {
  process.exit(0);
}

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    cwd: projectRoot,
    stdio: "ignore",
  });
} catch (error) {
  console.warn("[setup-git-hooks] Failed to configure core.hooksPath:", error);
}
