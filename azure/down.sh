#!/bin/bash

cd ./kafka
  ./down.sh
cd -

cd ./mongodb
  ./down.sh
cd -

cd ./sawtooth
  ./down.sh
cd -

cd ./app
 ./down.sh
cd -

kubectl -f ./storage-class-minikube.yaml delete

kubectl delete pvc --all
kubectl delete pv --all
