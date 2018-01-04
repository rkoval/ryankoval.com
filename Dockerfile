FROM nginx:1.13.8-alpine
EXPOSE 80
COPY ./docker_root /
COPY ./dist/. /usr/share/nginx/html
