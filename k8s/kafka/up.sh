#!/bin/bash

helm install kafka-release bitnami/kafka --version 11.8.7 -f ./config.yaml
