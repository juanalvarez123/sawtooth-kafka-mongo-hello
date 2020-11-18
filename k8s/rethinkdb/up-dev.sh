#!/bin/bash

#https://github.com/helm/charts/tree/master/stable/rethinkdb
helm install rethinkdb1 stable/rethinkdb --version 1.1.2 -f ./config.yaml

kubectl apply -f ./network.yaml

echo "admin"
echo "http://192.168.99.100:32018/"
