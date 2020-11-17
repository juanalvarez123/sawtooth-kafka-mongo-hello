#!/bin/bash

#https://github.com/helm/charts/tree/master/stable/rethinkdb
helm install rethinkdb1 stable/rethinkdb --version 1.1.2 -f ./config.yaml

kubectl apply -f ./network.yaml



#kubectl proxy
#http://localhost:8001/api/v1/namespaces/default/services/rethinkdb1-rethinkdb-admin/proxy/
