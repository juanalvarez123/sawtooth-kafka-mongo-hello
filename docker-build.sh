#!/bin/bash

cd ./app
  docker build -t le999/app:1.0 .
cd -

cd ./tp
  docker build -t le999/tp:1.0 .
cd -
