## Kafka
https://hub.docker.com/r/bitnami/kafka/
'Accessing Kafka with internal and external clients'

https://github.com/Blizzard/node-rdkafka
https://kafka.apache.org/quickstart


```bash

docker exec -it kafka_kafka_1 bash
/opt/bitnami/kafka/bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --topic mytopic --partitions 1 --replication-factor 1
/opt/bitnami/kafka/bin/kafka-topics.sh --describe --zookeeper zookeeper:2181 --topic mytopic
/opt/bitnami/kafka/bin/kafka-console-producer.sh --topic mytopic --bootstrap-server localhost:9092
/opt/bitnami/kafka/bin/kafka-console-consumer.sh --topic mytopic --from-beginning --bootstrap-server localhost:9092

```

