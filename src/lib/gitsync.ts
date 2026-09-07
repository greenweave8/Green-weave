import "server-only";
import { execFileSync } from "child_process";

/**
 * After the admin edits tracked data (product catalog, site content), commit
 * the changed file to git and push it so the repo (and anything deployed from
 * it) reflects the change.
 *
 * Only runs in a local/dev git checkout: production servers (e.g. Render) do
 * not have push credentials and keep their data on their own disk instead.
 *
 * Returns true when a commit+push was performed, false when skipped or failed.
 */
export function syncFileToGit(relPath: string, message: string): boolean {
  try {
    if (process.env.NODE_ENV === "production") return false;
    if (process.env.GIT_SYNC === "false") return false;

    if (git(["rev-parse", "--is-inside-work-tree"]) === null) return false;

    const changed = git(["status", "--porcelain", "--", relPath]);
    if (!changed) return false;

    const headBefore = git(["rev-parse", "HEAD"]);
    if (git(["add", "--", relPath]) === null) {
      console.error(`[gitsync] Could not stage ${relPath} for git.`);
      return false;
    }

    // If staging produced no difference vs the last commit, there is nothing
    // to push (e.g. admin reverted their edit back to the committed text).
    // `git diff --cached --quiet` exits 1 when a difference exists, which the
    // helper below reports as null, so only a clean index returns non-null.
    let hasStagedDiff = false;
    try {
      execFileSync("git", ["diff", "--cached", "--quiet", "--", relPath], {
        cwd: process.cwd(),
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        timeout: 20000,
        stdio: "pipe",
      });
    } catch {
      hasStagedDiff = true;
    }
    if (!hasStagedDiff) return false;

    // Commit exactly what was staged above (no pathspec, so index-only content
    // is committed and line-ending conversion on the worktree can't interfere).
    if (git(["commit", "-m", message]) === null) {
      console.error(`[gitsync] Could not commit ${relPath} to git.`);
      return false;
    }

    const headAfter = git(["rev-parse", "HEAD"]);
    if (!headAfter || headAfter === headBefore) {
      console.error(`[gitsync] Commit reported success but HEAD is unchanged.`);
      return false;
    }

    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
    if (branch) {
      if (git(["push", "origin", branch]) === null) {
        console.error(`[gitsync] Commit created but push to origin/${branch} failed.`);
      }
    }

    console.log(`[gitsync] Committed ${relPath} (${headAfter.slice(0, 7)}).`);
    return true;
  } catch (err) {
    console.error(`[gitsync] Could not sync ${relPath} to git:`, err);
    return false;
  }
}

export function syncCatalogToGit(): boolean {
  return syncFileToGit(
    "data/catalog.json",
    "Update product catalog (admin edit)"
  );
}

function git(args: string[]): string | null {
  const env = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      env,
      encoding: "utf8",
      timeout: 20000,
      stdio: "pipe",
    }).trim();
  } catch (err) {
    console.error(`[gitsync] git ${args.join(" ")} failed`, (err as Error).message);
    return null;
  }
}