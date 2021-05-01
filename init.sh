#!/bin/bash

cd ./app
  npm install
  rm ./.env
  cp ./.env.docker-compose ./.env
cd -

cd ./tp1
  npm install
  rm ./.env
  cp ./.env.docker-compose ./.env
cd -