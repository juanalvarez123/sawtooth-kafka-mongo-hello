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

class Tp1Handler extends TransactionHandler {
  constructor() {
    super(TP_FAMILY, [TP_vERSION], [TP_NAMESPACE])
  }

  async apply(transactionProcessRequest, context) {
    try {
      const {authorizationId, doctorSign, description} = JSON.parse(Buffer.from(transactionProcessRequest.payload, 'utf8').toString());

      // GET
      let possibleAddressValues = await context.getState([address(authorizationId)]);
      let stateValueRep = possibleAddressValues[address(authorizationId)];

      if (!stateValueRep || stateValueRep.length == 0) {
        console.log('No previous state');
      } else {
        console.log('Previous state:', JSON.parse(Buffer.from(stateValueRep, "utf8")));
      }

      // PUT
      let addresses = await context.setState({
        [address(authorizationId)]: Buffer.from(JSON.stringify({authorizationId, doctorSign, description}), 'utf8')
      }, 100)

      if (addresses.length === 0) {
        throw new InternalError('State Error!');
      }

      console.log('PUT', JSON.stringify({authorizationId, doctorSign, description}));
    } catch (err) {
      throw new InvalidTransaction('Bad transaction', err);
    }
  }
}

module.exports = Tp1Handler
