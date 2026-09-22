import "server-only";
import { execFileSync } from "child_process";

/**
 * After the admin edits tracked data (product catalog, site content), commit
 * the changed file to git and push it so the repo (and anything deployed from
 * it) reflects the change.
 *
 * Two modes are supported:
 *  - "local": a dev git checkout (e.g. `npm run dev`). Pushes with the user's
 *    existing git credentials.
 *  - "remote": a deployed server (e.g. Render) where GIT_PUSH_TOKEN is set to a
 *    GitHub personal access token (scope: repo). Pushes over HTTPS using that
 *    token, so admin edits made on the live site also land in git.
 *
 * Sync is skipped entirely otherwise (production without a token — the data is
 * still saved to the server's own disk).
 *
 * Returns true when a commit+push was performed, false when skipped or failed.
 */

const PUSH_TOKEN = process.env.GIT_PUSH_TOKEN || "";

/** Error message from the most recent push attempt (null when clean). */
let lastPushError: string | null = null;

export function getSyncError(): string | null {
  return lastPushError;
}

type SyncMode = "local" | "remote";

function syncMode(): SyncMode | null {
  if (process.env.GIT_SYNC === "false") return null;
  if (git(["rev-parse", "--is-inside-work-tree"], true) === null) return null;
  if (process.env.NODE_ENV === "production") {
    return PUSH_TOKEN ? "remote" : null;
  }
  return "local";
}

export function syncFileToGit(relPath: string, message: string): boolean {
  return syncPathsToGit([relPath], message);
}

export function syncPathsToGit(relPaths: string[], message: string): boolean {
  const mode = syncMode();
  if (!mode) return false;
  lastPushError = null;
  try {
    const changed = git(["status", "--porcelain", "--", ...relPaths]);
    if (!changed) return false;

    const headBefore = git(["rev-parse", "HEAD"]);
    if (git(["add", "--", ...relPaths]) === null) {
      console.error(`[gitsync] Could not stage ${relPaths.join(", ")} for git.`);
      return false;
    }

    // If staging produced no difference vs the last commit, there is nothing
    // to push (e.g. admin reverted their edit back to the committed text).
    // `git diff --cached --quiet` exits 1 when a difference exists, which the
    // helper below reports as null, so only a clean index returns non-null.
    let hasStagedDiff = false;
    try {
      execFileSync(
        "git",
        ["diff", "--cached", "--quiet", "--", ...relPaths],
        {
          cwd: process.cwd(),
          env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
          timeout: 20000,
          stdio: "pipe",
        }
      );
    } catch {
      hasStagedDiff = true;
    }
    if (!hasStagedDiff) return false;

    ensureIdentity();

    // Commit exactly what was staged above (no pathspec, so index-only content
    // is committed and line-ending conversion on the worktree can't interfere).
    if (git(["commit", "-m", message]) === null) {
      console.error(`[gitsync] Could not commit ${relPaths.join(", ")} to git.`);
      return false;
    }

    const headAfter = git(["rev-parse", "HEAD"]);
    if (!headAfter || headAfter === headBefore) {
      console.error(`[gitsync] Commit reported success but HEAD is unchanged.`);
      return false;
    }

    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
    if (branch) {
      const pushError = pushBranch(branch, mode);
      if (pushError) {
        lastPushError = pushError;
        console.error(
          `[gitsync] Commit created but push to origin/${branch} failed (${mode}): ${pushError}`
        );
      }
    }

    console.log(`[gitsync] Committed ${relPaths.join(", ")} (${headAfter.slice(0, 7)}).`);
    return true;
  } catch (err) {
    console.error(`[gitsync] Could not sync ${relPaths.join(", ")} to git:`, err);
    return false;
  }
}

function ensureIdentity(): void {
  if (git(["config", "user.email"], true) === null) {
    git([
      "config",
      "user.email",
      process.env.GIT_COMMITTER_EMAIL ||
        "greenweave-bot@users.noreply.github.com",
    ]);
  }
  if (git(["config", "user.name"], true) === null) {
    git([
      "config",
      "user.name",
      process.env.GIT_COMMITTER_NAME || "greenweave bot",
    ]);
  }
}

function defaultBranch(): string {
  const ref = git(["rev-parse", "--abbrev-ref", "origin/HEAD"], true);
  if (ref && ref.startsWith("origin/")) return ref.slice("origin/".length);
  return "main";
}

/**
 * Pushes to origin. Returns a descriptive error message on failure, or null on
 * success.
 *
 * Deployed servers (Render) check out a bare commit, so git reports a detached
 * HEAD. Pushing the local `HEAD` ref with an explicit `refs/heads/<branch>`
 * destination works whether HEAD is attached or detached.
 */
function pushBranch(branch: string, mode: SyncMode): string | null {
  const env = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
  let args: string[];
  if (mode === "remote") {
    const auth = Buffer.from(
      `x-access-token:${PUSH_TOKEN}`,
      "utf8"
    ).toString("base64");
    const target = defaultBranch();
    args = [
      "-c",
      `http.extraheader=AUTHORIZATION: basic ${auth}`,
      "push",
      "origin",
      `HEAD:refs/heads/${target}`,
    ];
  } else {
    args = ["push", "origin", branch];
  }
  try {
    execFileSync("git", args, {
      cwd: process.cwd(),
      env,
      encoding: "utf8",
      timeout: 30000,
      stdio: "pipe",
    });
    return null;
  } catch (err) {
    return (err as Error).message;
  }
}

export function syncCatalogToGit(): boolean {
  return syncPathsToGit(
    ["data/catalog.json", "public/uploads"],
    "Update product catalog (admin edit)"
  );
}

/** True when this server can actually commit+push (local checkout or remote with token). */
export function canGitSync(): boolean {
  return syncMode() !== null;
}

/** Current sync state of a tracked data file, for admin status UIs. */
export function getSyncStatus(
  relPath: string
): { pending: boolean; canPush: boolean } {
  const canPush = canGitSync();
  const pending =
    canPush && Boolean(git(["status", "--porcelain", "--", relPath]));
  return { pending, canPush };
}

/** Sync state of the product catalog, including its image uploads. */
export function getCatalogSyncStatus(): {
  pending: boolean;
  canPush: boolean;
} {
  const canPush = canGitSync();
  const pending =
    canPush &&
    Boolean(
      git([
        "status",
        "--porcelain",
        "--",
        "data/catalog.json",
        "public/uploads",
      ])
    );
  return { pending, canPush };
}

function git(args: string[], quiet = false): string | null {
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
    if (!quiet) {
      console.error(`[gitsync] git ${args.join(" ")} failed`, (err as Error).message);
    }
    return null;
  }
}