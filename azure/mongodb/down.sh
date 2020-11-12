#!/bin/bash

helm delete mongodb0
helm delete mongodb1

kubectl delete -f ./network.yaml
