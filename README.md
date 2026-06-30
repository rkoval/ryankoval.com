# ryankoval.com

Personal website and resume for Ryan Koval, built with TanStack Start, React,
Vite, Tailwind CSS, and Bun.

## Local Development

Use the pinned Node version, then install dependencies:

```bash
nvm use
bun install
```

Start the dev server:

```bash
bun run dev
```

Common commands:

```bash
bun run build
bun run preview
bun run lint
```

Resume data lives in `src/resume.yml`. After changing resume content or print
styles, regenerate the downloadable PDFs:

```bash
bun run generate-resume-pdf
```
