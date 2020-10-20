const Kafka = require('node-rdkafka');
const _ = require('underscore');

let HOST = process.env.HOST_PRODUCER;
if(!HOST){
  HOST = 'localhost:9092';
}

console.log('HOST:', HOST);

// const HOST = '192.168.99.100:30092';

const client = Kafka.AdminClient.create({
  'client.id': 'kafka-admin',
  'metadata.broker.list': HOST
});


var consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': HOST,
}, {});

consumer.connect();
consumer
  .on('ready', function() {
    consumer.getMetadata({
      topic: 'mytopic',
      timeout: 10000
    }, function(err, metadata) {
      console.log(err, metadata);
      if (err) {
        console.error('Error getting metadata');
        console.error(err);
      } else {
        console.log('Got metadata');
        console.log(metadata);
        let mytopicExists = _.some(metadata.topics, (t) => {return t.name == 'mytopic'});
        if(!mytopicExists){
          console.log('Creating topic')
          client.createTopic({
             topic: 'mytopic',
             num_partitions: 1,
             replication_factor: 1
           }, function(err) {
             // Done!
             console.log(err)
           }); 
        }
      }
    });
  })




// Our producer with its Kafka brokers
// This call returns a new writable stream to our topic 'topic-name'
var stream = Kafka.Producer.createWriteStream({
  'group.id': 'kafka',
  'metadata.broker.list': HOST
}, {}, {
  topic: 'mytopic'
});

// Writes a message to the stream
var queuedSuccess = stream.write(Buffer.from('Awesome message'));

if (queuedSuccess) {
  console.log('We queued our message!');
} else {
  // Note that this only tells us if the stream's queue is full,
  // it does NOT tell us if the message got to Kafka!  See below...
  console.log('Too many messages in our queue already');
}

// NOTE: MAKE SURE TO LISTEN TO THIS IF YOU WANT THE STREAM TO BE DURABLE
// Otherwise, any error will bubble up as an uncaught exception.
stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream');
  console.error(err);
})
