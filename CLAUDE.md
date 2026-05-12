# Secured Website — Claude Code Instructions

## Repository

- **Origin**: https://github.com/flent-homes/website-v2 (upstream, shared)
- **Backup**: https://github.com/joelmihavel/secured-v1.3 (remote name: `secured`)
- **Stack**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Leaflet

## Branching & Backup Strategy

Every major change must be preserved on its own branch so nothing is lost and any version can be restored.

### Branch naming

Use this format: `secured/<category>/<short-name>`

| Category   | Use for                                      | Example                              |
|------------|----------------------------------------------|--------------------------------------|
| `feature`  | New functionality or sections                | `secured/feature/rent-checker`       |
| `redesign` | Visual/layout overhauls                      | `secured/redesign/hero-map`          |
| `fix`      | Bug fixes                                    | `secured/fix/leaflet-scroll`         |
| `refactor` | Internal restructuring, no visible change    | `secured/refactor/split-components`  |
| `exp`      | Experiments that may or may not ship         | `secured/exp/3d-map-tiles`           |

### Before starting major work

1. **Create a snapshot branch** of the current state before touching anything:
   ```
   git branch secured/snapshot/<date>-<what>   # e.g. secured/snapshot/2026-04-23-pre-hero-revamp
   ```
2. **Create a feature branch** from `main` for the new work:
   ```
   git checkout -b secured/feature/<name>
   ```
3. Work and commit on the feature branch. Commit often with clear messages.

### After completing major work

1. Push the feature branch to the backup remote:
   ```
   git push secured secured/feature/<name>
   ```
2. Merge to `main` only when the user confirms it's ready.
3. Push `main` to the backup remote:
   ```
   git push secured main
   ```

### Rules

- **Never force-push `main`** on either remote.
- **Never delete snapshot branches** — they are permanent restore points.
- **Always push to the `secured` remote** (backup) after any commit to `main`. The `origin` remote is shared and should only be pushed to when the user explicitly asks.
- **Tag milestones** when the user says a version is "done" or "ready to ship":
  ```
  git tag -a v1.3.<n> -m "description"
  git push secured v1.3.<n>
  ```
- If an experiment (`exp/`) branch doesn't ship, leave it on the backup remote — don't delete it.

### Recovery

To restore any previous state:
```
git log --oneline --all --graph   # find the branch or tag
git checkout secured/snapshot/<name>  # inspect it
git checkout -b secured/fix/<name>   # branch from it to fix forward
```

## Commit Messages

Follow the existing repo style:
- Start with a verb (add, update, fix, remove, wire, revamp)
- First line: short summary (under 72 chars)
- Body: bullet points of what changed and why
- Always include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

## Push Defaults

- `git push secured <branch>` — always safe, this is the personal backup
- `git push origin <branch>` — ask the user first, this is the shared repo
