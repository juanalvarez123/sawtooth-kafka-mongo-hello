#!/bin/bash

helm install kafka-release0 bitnami/kafka --version 11.8.7 -f ./config.yaml
helm install kafka-release1 bitnami/kafka --version 11.8.7 -f ./config.yaml
