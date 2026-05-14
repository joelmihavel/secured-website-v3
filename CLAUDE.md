# Flent Website v2 — Claude Code Instructions

## Who I'm working with

Dhiram has a product and business background with limited hands-on technical depth. Claude should:
- Explain what it's about to do before doing it, in plain English
- Never assume technical context — spell out the "why" behind any non-obvious step
- Flag any action that could affect the live site or shared codebase before taking it
- Ask before doing anything irreversible

---

## The #1 rule: stability first

The live website is production. Every change, no matter how small, must go through a branch and a Pull Request. This is non-negotiable.

**NEVER push directly to `main`.** Not once. Not even a typo fix. Not even "just this one time."

**ALWAYS raise a Pull Request on GitHub** before anything touches `main`. Dhiram reviews and approves it there.

If Claude is ever unsure whether something should go directly to main or through a PR — the answer is always: PR.

---

## Repository

- **Shared repo (origin)**: https://github.com/flent-homes/website-v2
- **Backup remote**: https://github.com/joelmihavel/secured-v1.3 (remote name: `secured`)
- **Stack**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Leaflet

---

## How every piece of work must flow

```
main (never touched directly)
  └── feature/fix branch  ← all work happens here
        └── PR on GitHub  ← Dhiram reviews
              └── merge into main (only after approval)
```

### Step-by-step for any change

1. **Before touching anything**, take a snapshot so we can always go back:
   ```
   git branch snapshot/<date>-<description>
   # e.g. snapshot/2026-05-13-pre-navbar-update
   ```

2. **Create a working branch** from `main`:
   ```
   git checkout -b <branch-name>
   ```

3. **Make changes and commit** often with clear messages explaining what changed and why.

4. **Push the branch to GitHub**:
   ```
   git push origin <branch-name>
   ```

5. **Open a Pull Request** on GitHub — never merge locally. Dhiram approves before anything merges.

6. **After merge**, push a copy to the backup remote:
   ```
   git push secured <branch-name>
   ```

---

## Branch naming

| Type       | When to use                               | Example                              |
|------------|-------------------------------------------|--------------------------------------|
| `feature/` | New section, page, or functionality       | `feature/rent-calculator`            |
| `fix/`     | Bug fixes                                 | `fix/mobile-nav-overlap`             |
| `redesign/`| Visual or layout overhauls               | `redesign/homepage-hero`             |
| `refactor/`| Restructuring with no visible change      | `refactor/split-header-component`    |
| `exp/`     | Experiments — may or may not ship         | `exp/animated-map-tiles`             |
| `snapshot/`| Restore points, never deleted             | `snapshot/2026-05-13-stable`         |

---

## What Claude must always do

- **Explain the plan first** — before any code change, describe in plain English what will be done and why
- **One branch per task** — never mix unrelated changes on the same branch
- **Commit often** — small, frequent commits with clear messages are better than one big commit
- **Never delete snapshot branches** — they are permanent restore points
- **Never force-push** any branch
- **Ask before pushing to origin** — always confirm with Dhiram before pushing to the shared repo
- **Never run `npm audit fix --force`** or upgrade dependencies without explicit instruction — dependency changes can silently break the site

## What Claude must never do

- Push to `main` directly — ever
- Merge branches locally into `main`
- Delete or rewrite git history
- Make changes to `vercel.json`, CI config, or environment variables without explicit instruction
- Touch `.env` files or hardcode any secrets or API keys
- Make assumptions about what "looks right" on the live site — always ask Dhiram to verify visually

---

## Commit message format

```
<verb>: <short summary under 72 characters>

- What changed (bullet points)
- Why it changed

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Verbs to use: `add`, `update`, `fix`, `remove`, `wire`, `revamp`, `refactor`

---

## Talking to Dhiram about code

- Use plain English. Avoid jargon unless necessary, and always define it when used.
- When suggesting options, explain the trade-off in business terms (speed, risk, user experience) not just technical terms.
- When something could break the live site, say so clearly and upfront — don't bury the risk.
- If a task is ambiguous, ask one focused clarifying question rather than proceeding with assumptions.

---

## Recovery — if something goes wrong

Every snapshot branch is a full restore point. To go back:

```
git log --oneline --all --graph       # see all branches and history
git checkout snapshot/<name>          # inspect that state
git checkout -b fix/<recovery-name>   # branch from it to fix forward
```

Never panic-delete or force-push. Slow down, find the snapshot, branch from it.
