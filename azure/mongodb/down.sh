#!/bin/bash

helm delete mongodb1

kubectl delete -f ./network.yaml
