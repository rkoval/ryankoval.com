# Debian-based image (not alpine): esbuild postinstall needs glibc, especially under amd64 QEMU on arm64 Macs.
FROM oven/bun:1.3.14 AS build
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
# Skip lovable-tagger's nested esbuild postinstall (dev-only componentTagger); vite uses top-level esbuild.
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
EXPOSE 80
COPY docker_root/ /
COPY --from=build /app/dist/client/ /usr/share/nginx/html/
