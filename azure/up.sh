#!/bin/bash

cd ./kafka
  ./up.sh
cd -

cd ./mongodb
  ./up.sh
cd -

cd ./sawtooth
  ./up.sh
cd -

# cd ./app
#  .up.sh
# cd -