#!/bin/bash

docker rm $(docker ps -a -q)
docker-compose -f ./docker-compose.yaml -v down
# docker volume prune -f
