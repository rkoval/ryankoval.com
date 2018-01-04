#!/usr/bin/env bash -ex
npm run build
docker-compose build
