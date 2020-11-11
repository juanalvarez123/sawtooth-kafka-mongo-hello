#!/bin/bash

#https://sawtooth.hyperledger.org/docs/core/releases/latest/app_developers_guide/kubernetes_test_network.html

cd "./sawtooth-pbft"

  kubectl delete -f ./pbft-keys-configmap.yaml
  kubectl apply -f ./sawtooth-create-keys.yaml

  KEY_CONTAINER=$(kubectl get pods | awk '/pbft-keys-/ {print $1}')
  kubectl wait --for=condition=complete --timeout=60s job.batch/pbft-keys 

  FILE="./pbft-keys-configmap.yaml"

  cat "./pbft-keys-configmap.template.yaml" > $FILE
  echo "# auto-generated" >> $FILE
  kubectl logs $KEY_CONTAINER | awk '{print "  " $0}' >> $FILE

  kubectl delete -f ./sawtooth-create-keys.yaml
  kubectl apply -f ./pbft-keys-configmap.yaml
  sleep 10

  kubectl apply -f ./sawtooth.yaml
  kubectl apply -f ./ingress.yaml

cd - 

../scripts/wait-for-pods.sh pbft-0 pbft-1 pbft-2 pbft-3 
