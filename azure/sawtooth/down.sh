#!/bin/bash

cd "./sawtooth-pbft"

  kubectl delete -f ./sawtooth.yaml
  kubectl delete -f ./sawtooth-create-keys.yaml
  kubectl delete -f ./pbft-keys-configmap.yaml
  kubectl delete -f ./ingress.yaml

cd -
