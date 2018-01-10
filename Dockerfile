FROM node:9.1.0-alpine
COPY . .
RUN npm install && npm run build
VOLUME node_modules

FROM nginx:1.13.8-alpine
EXPOSE 80
COPY ./docker_root /
COPY --from=0 ./dist/. /usr/share/nginx/html
