# Agent instructions

## Shell environment (nvm + bun)

Agent shell sessions often start with the wrong Node version. **Always activate the project's nvm Node before running `bun`, `npm`, `vite`, or other tooling.**

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use
```

Run that from the repo root (`.nvmrc` selects the version). Prefix one-off commands the same way:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use && bun run build
```

Why this matters:

- `.nvmrc` pins **Node v22.22.0** (Vite requires 20.19+ or 22.12+)
- `bun` is installed under that nvm Node (`~/.nvm/versions/node/v22.22.0/bin/bun`), not the system default
- The shell default (e.g. v22.2.0) leaves `bun: command not found` and breaks `bun run build`

## Résumé PDFs

After changes to `src/resume.yml` or résumé/print CSS, regenerate static downloads (dev server must be running on port 8080):

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use && bun run generate-resume-pdf
```

Writes `public/resume/ryan-koval-resume.pdf` and `public/resume/ryan-koval-resume-dark.pdf`.
