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
#  ./up.sh
# cd -

./wait-for-pods.sh pbft-0 pbft-1 pbft-2 pbft-3