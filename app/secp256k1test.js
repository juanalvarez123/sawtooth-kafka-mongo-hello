const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const CryptoJS = require('crypto-js');

const msg = randomBytes(32)

// generate privKey
let privKey
do {
  privKey = randomBytes(32)
} while (!secp256k1.privateKeyVerify(privKey))

privKey = Buffer.from("104b1cf90d4171c1b606e53ffe2f52c6f46320b06ef9c1a8fa01f5a0c4ca339a", "hex")

// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(privKey)

// // sign the message
// const sigObj = secp256k1.ecdsaSign(msg, privKey)

// // verify the signature
// console.log(secp256k1.ecdsaVerify(sigObj.signature, msg, pubKey))

require('dotenv').config();

const axios = require('axios');
const privateKey = privKey;
const crypto = require('crypto');

const cbor = require('cbor')

const HOST = process.env.SAWTOOTH_HOST;

const hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const INT_KEY_FAMILY = 'intkey'
const INT_KEY_NAMESPACE = hash(INT_KEY_FAMILY).substring(0, 6)
const address = INT_KEY_NAMESPACE + hash('foo').slice(-64)

let ss = crypto.createHash('sha512').update('intkey').digest('hex');
console.log('intkey:', hash('intkey'));
console.log('address:', address);

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

const publicKey = Buffer.from(pubKey).toString('hex');
console.log('public:', publicKey);
console.log('private:', privKey.toString('hex'));

const transactionHeaderBytes = protobuf.TransactionHeader.encode({
  familyName: 'intkey',
  familyVersion: '1.0',
  inputs: [address],
  outputs: [address],
  signerPublicKey: publicKey,
  // In this example, we're signing the batch with the same private key,
  // but the batch can be signed by another party, in which case, the
  // public key will need to be associated with that key.
  batcherPublicKey: publicKey,
  // In this example, there are no dependencies.  This list should include
  // an previous transaction header signatures that must be applied for
  // this transaction to successfully commit.
  // For example,
  // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
  dependencies: [],
  payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
  nonce:"hey4"
}).finish()

// let signature = signer.sign(transactionHeaderBytes)
let dataHash = createHash('sha256').update(transactionHeaderBytes).digest()

let result = secp256k1.ecdsaSign(dataHash, privKey);
signature = Buffer.from(result.signature).toString('hex')

console.log('sha1:', createHash('sha512').update(payloadBytes).digest('hex'))
console.log('signature1:', signature)
// let signature = secp256k1.ecdsaSign(transactionHeaderBytes, privKey);

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
  signerPublicKey: publicKey,
  transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()



// signature = signer.sign(batchHeaderBytes)
dataHash = createHash('sha256').update(batchHeaderBytes).digest()
result = secp256k1.ecdsaSign(dataHash, privKey)
signature = Buffer.from(result.signature).toString('hex')
// signature = secp256k1.ecdsaSign(batchHeaderBytes, privKey);

const batch = protobuf.Batch.create({
  header: batchHeaderBytes,
  headerSignature: signature,
  transactions: transactions
})



const batchListBytes = protobuf.BatchList.encode({
  batches: [batch]
}).finish()

// console.log(Buffer.from(batchListBytes).toString('hex'));

// axios.post(`${HOST}/batches`, batchListBytes, {
//   headers: {'Content-Type': 'application/octet-stream'}
// })
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((err)=>{
//     console.log(err);
//   });


