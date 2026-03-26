FROM node:16.15.0-alpine AS webpack
COPY *.json ./
RUN npm install && npm cache clean --force
VOLUME ["./node_modules"]
COPY static ./static
COPY *.js ./
COPY src ./src
RUN npm run build

# FROM browserless/chrome:1.59-puppeteer-1.20.0@sha256:bf82032782dfc6de7d24ca65ac94ec117f89dc35f72df3800c599bd201120b23 AS pdf # arm64 hash
# use specific sha for amd64 build
FROM browserless/chrome:1.59-puppeteer-1.20.0@sha256:c481de14ad1285486496c1d03d05f9c0723b7fd56f5a554f07f35fb2477931d4 AS pdf
WORKDIR /tmp/dist
COPY --from=webpack ./dist/. .
RUN google-chrome \
      --headless \
      --no-sandbox \
      --disable-gpu \
      --print-to-pdf="resume.pdf" \
      --run-all-compositor-stages-before-draw \
      ./resume.html
RUN chmod +r resume.pdf

FROM nginx:1.21.6-alpine
EXPOSE 80
COPY ./docker_root /
COPY --from=webpack ./dist/. /usr/share/nginx/html
COPY --from=pdf /tmp/dist/resume.pdf /usr/share/nginx/html/resume.pdf
