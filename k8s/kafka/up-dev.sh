#!/bin/bash

helm install kafka-release bitnami/kafka --version 11.8.7 -f ./config-dev.yaml

# helm show values bitnami/kafka


# Kafka can be accessed by consumers via port 9092 on the following DNS name from within your cluster:

#     kafka-release.default.svc.cluster.local

# Each Kafka broker can be accessed by producers via port 9092 on the following DNS name(s) from within your cluster:

#     kafka-release-0.kafka-release-headless.default.svc.cluster.local:9092

# To create a pod that you can use as a Kafka client run the following commands:

#     kubectl run kafka-release-client --restart='Never' --image docker.io/bitnami/kafka:2.6.0-debian-10-r30 --namespace default --command -- sleep infinity
#     kubectl exec --tty -i kafka-release-client --namespace default -- bash

#     PRODUCER:
#         kafka-console-producer.sh \

#             --broker-list kafka-release-0.kafka-release-headless.default.svc.cluster.local:9092 \
#             --topic test

#     CONSUMER:
#         kafka-console-consumer.sh \

#             --bootstrap-server kafka-release.default.svc.cluster.local:9092 \
#             --topic test \
#             --from-beginning


