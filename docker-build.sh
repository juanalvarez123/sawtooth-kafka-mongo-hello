#!/bin/bash

cd ./app
  docker build -t le999/app:1.0 .
cd -

cd ./tp1
  docker build -t le999/tp1:1.0 .
cd -
