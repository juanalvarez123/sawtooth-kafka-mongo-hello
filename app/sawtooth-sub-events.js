// Based on:
// https://github.com/hyperledger-archives/sawtooth-supply-chain
// https://sawtooth.hyperledger.org/docs/core/releases/latest/app_developers_guide/about_events.html

require('dotenv').config();
const _ = require('lodash')

const { Stream } = require('sawtooth-sdk/messaging/stream')
const {
  Message,
  EventList,
  EventSubscription,
  EventFilter,
  StateChangeList,
  ClientEventsSubscribeRequest,
  ClientEventsSubscribeResponse
} = require('sawtooth-sdk/protobuf')


const PREFIX = '3400de'
const NULL_BLOCK_ID = '0000000000000000'

const VALIDATOR_HOST = process.env.VALIDATOR_HOST;
// const VALIDATOR_HOST = 'tcp://localhost:4004';
console.log('connecting to ', VALIDATOR_HOST);
stream = new Stream(VALIDATOR_HOST);

const start = new Promise((resolve)=>{
  stream.connect(()=>{
    stream.onReceive(handleEvent);
    subscribe().then(resolve);
    console.log('Connected');
  });
})


const handleEvent = msg => {
  // const mmm = EventList.decode(msg.content).events
  // console.log('events', mmm);
  if (msg.messageType === Message.MessageType.CLIENT_EVENTS) {
    const events = EventList.decode(msg.content).events
    // console.log(events)
    _.forEach(events, e => {
      if(e.eventType == 'myevent'){
        console.log(e)
        console.log('data:', Buffer.from(e.data, 'utf8').toString('utf8'))
      }
    })
    // deltas.handle(getBlock(events), getChanges(events))
  } else {
    console.warn('Received message of unknown type:', msg.messageType)
  }
}


const subscribe = () => {
  const blockSub = EventSubscription.create({
    eventType: 'sawtooth/block-commit'
  })
  const deltaSub = EventSubscription.create({
    eventType: 'sawtooth/state-delta',
    filters: [EventFilter.create({
      key: 'address',
      matchString: `^${PREFIX}.*`,
      filterType: EventFilter.FilterType.REGEX_ANY
    })]
  })

  const mySub = EventSubscription.create({
    eventType: 'myevent'
  })

  return stream.send(
    Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST,
    ClientEventsSubscribeRequest.encode({
      lastKnownBlockIds: [NULL_BLOCK_ID],
      subscriptions: [blockSub, deltaSub, mySub]
    }).finish()
  )
    .then(response => ClientEventsSubscribeResponse.decode(response))
    .then(decoded => {
      const status = _.findKey(ClientEventsSubscribeResponse.Status,
                               val => val === decoded.status)
      if (status !== 'OK') {
        throw new Error(`Validator responded with status "${status}"`)
      }
    })
}
