#!/bin/bash

cd ./kafka
  ./up-dev.sh
cd -

cd ./mongodb
  ./up-dev.sh
cd -

