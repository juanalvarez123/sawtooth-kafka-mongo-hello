#!/bin/bash

helm delete kafka-release

kubectl delete -f ./ingress.yaml

