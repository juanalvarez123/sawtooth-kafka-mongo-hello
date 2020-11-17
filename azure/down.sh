#!/bin/bash

# cd ./kafka
#   ./down.sh
# cd -

# cd ./mongodb
#   ./down.sh
# cd -

cd ./rethinkdb
  ./down.sh
cd -

# cd ./sawtooth
#   ./down.sh
# cd -

# cd ./app
#  ./down.sh
# cd -

kubectl delete pvc --all
kubectl delete pv --all
