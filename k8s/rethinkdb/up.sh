#!/bin/bash

helm install rethinkdb1 stable/rethinkdb --version 1.1.2 -f ./config.yaml
