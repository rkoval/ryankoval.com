FROM nginx:1.13.8-alpine
COPY ./docker_root /
COPY ./dist/. /usr/share/nginx/html
