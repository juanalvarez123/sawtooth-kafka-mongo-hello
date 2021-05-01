require('dotenv').config()

const Kafka = require('node-rdkafka');
const _ = require('underscore');

console.log('KAFKA_CONSUMER:', process.env.KAFKA_CONSUMER);
console.log('KAFKA_PRODUCER:', process.env.KAFKA_PRODUCER);

if(!process.env.KAFKA_CONSUMER){
  console.log('No KAFKA_CONSUMER');
  process.exit(1);
}

if(!process.env.KAFKA_PRODUCER){
  console.log('No KAFKA_PRODUCER');
  process.exit(1);
}


function getMetadata(topic){
  const consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': process.env.KAFKA_PRODUCER,
  }, {});

  consumer.connect();
  return new Promise((resolve, reject) => {
    consumer
      .on('ready', function() {
        consumer.getMetadata({
          topic: topic,
          timeout: 10000
        }, function(err, metadata) {
          if (err) {
            reject(err);
          } else {
            resolve(metadata);
          }
        });
      });
  }).finally(() => {
    consumer.disconnect();
  });
}

function createTopic(topic){
  const client = Kafka.AdminClient.create({
    'client.id': 'kafka-admin',
    'metadata.broker.list': process.env.KAFKA_PRODUCER
  });

  let p = new Promise((resolve, reject) => {
    client.createTopic({
      topic: topic,
      num_partitions: 1,
      replication_factor: 1
    }, function(err) {
      if(err){
        if(err.message === "Topic 'mytopic' already exists."){
          return setTimeout(() => resolve(), 1000)
        }
        return reject(err);
      }
      resolve();
    }); 
  });

  p.finally(()=>{
    console.log('disconnect');
    client.disconnect();
  });

  return p;
}


module.exports = async () => {
  let meta;

  let metadata = await getMetadata('mytopic');
  let mytopicExists = _.some(metadata.topics, (t) => {return t.name == 'mytopic'});
  if(!mytopicExists){
    return await createTopic('mytopic');
  }
}


module.exports();

