FROM node:16.15.0-alpine AS webpack
COPY *.json ./
RUN npm install && npm cache clean --force
VOLUME ["./node_modules"]
COPY static ./static
COPY *.js ./
COPY src ./src
RUN npm run build

FROM nginx:1.21.6-alpine
EXPOSE 80
COPY ./docker_root /
COPY --from=webpack ./dist/. /usr/share/nginx/html
