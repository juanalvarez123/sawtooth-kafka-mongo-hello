'use strict'

const {TransactionHandler} = require('sawtooth-sdk/processor/handler')
const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')

const TP_FAMILY = 'tp1';
const TP_vERSION = '1.0';

const hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const TP_NAMESPACE = hash(TP_FAMILY).substring(0, 6)

const address = (k) => TP_NAMESPACE + hash(k).slice(-64)

class IntegerKeyHandler extends TransactionHandler {
  constructor() {
    super(TP_FAMILY, [TP_vERSION], [TP_NAMESPACE])
  }

  async apply(transactionProcessRequest, context) {
    try {
      const {key, value} = JSON.parse(Buffer.from(transactionProcessRequest.payload, 'utf8').toString());

      context.addEvent("myevent",
          [['name', 'myname']],
          Buffer.from("hello", "utf8"));

      // GET
      let possibleAddressValues = await context.getState([address(key)]);
      let stateValueRep = possibleAddressValues[address(key)];

      if (!stateValueRep || stateValueRep.length == 0) {
        console.log('No previous state');
      } else {
        console.log('Previous state:', JSON.parse(Buffer.from(stateValueRep, "utf8")));
      }

      // PUT
      let addresses = await context.setState({
        [address(key)]: Buffer.from(JSON.stringify({key, value}), 'utf8')
      }, 100)

      if (addresses.length === 0) {
        throw new InternalError('State Error!');
      }

      console.log('PUT', key, ':', value);
    } catch (err) {
      throw new InvalidTransaction('Bad transaction', err);
    }
  }
}

module.exports = IntegerKeyHandler
