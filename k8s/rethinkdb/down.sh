#!/bin/bash

helm uninstall rethinkdb1

kubectl delete -f ./network.yaml
