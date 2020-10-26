require('dotenv').config();
const axios = require('axios');
const HOST = process.env.SAWTOOTH_HOST;


const secp256k1 = require('secp256k1')
const CryptoJS = require('crypto-js');
const cbor = require('cbor')

// const msg = randomBytes(32)

// generate privKey
// let privKey
// do {
//   privKey = randomBytes(32)
// } while (!secp256k1.privateKeyVerify(privKey))

let privKey = Buffer.from("104b1cf90d4171c1b606e53ffe2f52c6f46320b06ef9c1a8fa01f5a0c4ca339a", "hex")

// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(privKey)

const publicKey = Buffer.from(pubKey).toString('hex');

const hash = (x) =>
  CryptoJS.SHA512(x).toString(CryptoJS.enc.Hex)

// let ss2 = Buffer.from(ss).toString('hex')
console.log('intkey', hash('intkey'));


const INT_KEY_FAMILY = 'intkey'
const INT_KEY_NAMESPACE = hash(INT_KEY_FAMILY).substring(0, 6)
const address = INT_KEY_NAMESPACE + hash('foo').slice(-64)
console.log('address:',address);
const payload = {
  Verb: 'set',
  Name: 'foo',
  Value: 41
}

console.log('public:', publicKey);
console.log('private:', privKey.toString('hex'));

const payloadBytes = cbor.encode(payload)

const protobuf = require('sawtooth-sdk/protobuf')
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
  payloadSha512: CryptoJS.SHA512(arrayBufferToWordArray(payloadBytes)).toString(CryptoJS.enc.Hex),
  nonce:"hey4"
}).finish()

// let signature = signer.sign(transactionHeaderBytes)

// https://stackoverflow.com/questions/33914764/how-to-read-a-binary-file-with-filereader-in-order-to-hash-it-with-sha-256-in-cr
function arrayBufferToWordArray(ab) {
  var i8a = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
}

//https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

let sss=CryptoJS.SHA256(arrayBufferToWordArray(transactionHeaderBytes)).toString(CryptoJS.enc.Hex);
let dataHash=fromHexString(sss);

let result = secp256k1.ecdsaSign(dataHash, privKey);
let signature = Buffer.from(result.signature).toString('hex')

console.log('sha1:', CryptoJS.SHA512(arrayBufferToWordArray(payloadBytes)).toString(CryptoJS.enc.Hex))
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

//
sss=CryptoJS.SHA256(arrayBufferToWordArray(batchHeaderBytes)).toString(CryptoJS.enc.Hex);
dataHash=fromHexString(sss);
result = secp256k1.ecdsaSign(dataHash, privKey);
signature = Buffer.from(result.signature).toString('hex')

const batch = protobuf.Batch.create({
  header: batchHeaderBytes,
  headerSignature: signature,
  transactions: transactions
})

const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish()

  // console.log(Buffer.from(batchListBytes).toString('hex'));

axios.post(`${HOST}/batches`, batchListBytes, {
  headers: {'Content-Type': 'application/octet-stream'}
})
  .then((response) => {
    console.log(response.data);
  })
  .catch((err)=>{
    console.log(err);
  });