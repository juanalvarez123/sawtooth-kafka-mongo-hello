#!/bin/bash

#https://www.telepresence.io/tutorials/docker

# Similar to 
# kubectl run --rm -it borrar --image le999/app:1.0 --restart=Never -- bash

telepresence --docker-run --rm -it le999/app:1.0 bash

# MONGO_URI="mongodb://root:example@mongodb1:27017/mydb" node ./mongo-sample.js
# HOST_PRODUCER="kafka-release-0.kafka-release-headless.default.svc.cluster.local:9092" node ./send.js
# HOST_CONSUMER=kafka-release.default.svc.cluster.local:9092 node ./receive.js
