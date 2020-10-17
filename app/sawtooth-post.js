const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const axios = require('axios');
const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const signer = (new CryptoFactory(context)).newSigner(privateKey)
const crypto = require('crypto');

const cbor = require('cbor')

const HOST = 'http://localhost:8008';
// const HOST = 'http://192.168.99.100:30008';

const hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const INT_KEY_FAMILY = 'intkey'
const INT_KEY_NAMESPACE = hash(INT_KEY_FAMILY).substring(0, 6)
const address = INT_KEY_NAMESPACE + hash('foo').slice(-64)

const payload = {
  Verb: 'set',
  Name: 'foo',
  Value: 41
}

const payloadBytes = cbor.encode(payload)

const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')


//input and output addresses
//const _hash = (x) =>
//   crypto.createHash('sha512').update(x).digest('hex').toLowerCase()
//
//name = "foo"
//address = INT_KEY_NAMESPACE + _hash(name).slice(-64)

const transactionHeaderBytes = protobuf.TransactionHeader.encode({
  familyName: 'intkey',
  familyVersion: '1.0',
  inputs: [address],
  outputs: [address],
  signerPublicKey: signer.getPublicKey().asHex(),
  // In this example, we're signing the batch with the same private key,
  // but the batch can be signed by another party, in which case, the
  // public key will need to be associated with that key.
  batcherPublicKey: signer.getPublicKey().asHex(),
  // In this example, there are no dependencies.  This list should include
  // an previous transaction header signatures that must be applied for
  // this transaction to successfully commit.
  // For example,
  // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
  dependencies: [],
  payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
  nonce:"hey4"
}).finish()

let signature = signer.sign(transactionHeaderBytes)

const transaction = protobuf.Transaction.create({
  header: transactionHeaderBytes,
  headerSignature: signature,
  payload: payloadBytes
})

//--------------------------------------
//Optional
//If sending to sign outside

const txnListBytes = protobuf.TransactionList.encode({transactions:[
  transaction
]}).finish()

//const txnBytes2 = transaction.finish()

let transactions = protobuf.TransactionList.decode(txnListBytes).transactions;

//----------------------------------------

//transactions = [transaction]

const batchHeaderBytes = protobuf.BatchHeader.encode({
  signerPublicKey: signer.getPublicKey().asHex(),
  transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()



signature = signer.sign(batchHeaderBytes)

const batch = protobuf.Batch.create({
  header: batchHeaderBytes,
  headerSignature: signature,
  transactions: transactions
})



const batchListBytes = protobuf.BatchList.encode({
  batches: [batch]
}).finish()



axios.post(`${HOST}/batches`, batchListBytes, {
  headers: {'Content-Type': 'application/octet-stream'}
})
  .then((response) => {
    console.log(response.data);
  })
  .catch((err)=>{
    console.log(err);
  });

