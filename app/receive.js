require('dotenv').config()

const Kafka = require('node-rdkafka');

let HOST = process.env.HOST_CONSUMER;
if(!HOST){
  HOST = 'localhost:9093';
  // HOST = '192.168.99.100:30094';
}

console.log('HOST:', HOST);
// const HOST = 'localhost:9092';
// const HOST = '192.168.99.100:30092';

// Read from the librdtesting-01 topic... note that this creates a new stream on each call!
var stream = new Kafka.KafkaConsumer.createReadStream({
  'group.id': 'kafka',
  'metadata.broker.list': HOST,
  }, {}, {
  topics: ['mytopic']
});

stream.on('data', function(message) {
  console.log('Got message');
  console.log(message.value.toString());
});
