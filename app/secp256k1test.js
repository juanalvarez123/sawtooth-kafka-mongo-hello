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

console.log('sha1:', createHash('sha512').update(transactionHeaderBytes).digest('hex'))
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



let batchListBytes = protobuf.BatchList.encode({
  batches: [batch]
}).finish()


batchListBytes = Buffer.from(
  "0aa1070ac7010a42303338393737386133313730316233333330663738666236356361653732336233656562616531326439356364393535386663373234356132323332333664383934128001313134303735643663623765383032393763333064326132396631616263386536383066316663663664653831643734333934613636303037336136623061353666333530643238643864633464366365656438373266323461333139313232313037376361306130656563383666386236636665383862373330333030326512800138346631396234383162643730313166393264366633386333663738656365323464653435666437616532383237343732626538326232646339353965376139356665633333383439616263393032656334363639303736366133383663346162653830636632353363393762323931623832663335626532323766313437301ad1040aae030a423033383937373861333137303162333333306637386662363563616537323362336565626165313264393563643935353866633732343561323233323336643839341a06696e746b65792203312e302a46316366313236366532383263343162653565343235346438383230373732633535313861326335613863306337663765646131393539346137656235333934353365316564373204686579343a46316366313236366532383263343162653565343235346438383230373732633535313861326335613863306337663765646131393539346137656235333934353365316564374a80013031616465393033653232356231383135616164303037333134386336303036656138663337366334373936623033646466643939636237313864323765303662393065333066313830663664383561366563353663353763656366616266306534366162663163313962326639323664336435656165366538336334353862524230333839373738613331373031623333333066373866623635636165373233623365656261653132643935636439353538666337323435613232333233366438393412800131313430373564366362376538303239376333306432613239663161626338653638306631666366366465383164373433393461363630303733613662306135366633353064323864386463346436636565643837326632346133313931323231303737636130613065656338366638623663666538386237333033303032651a1ba3645665726263736574644e616d6563666f6f6556616c75651829",
  "hex"
  )

console.log(Buffer.from(batchListBytes).toString('hex'));

// axios.post(`${HOST}/batches`, batchListBytes, {
//   headers: {'Content-Type': 'application/octet-stream'}
// })
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((err)=>{
//     console.log(err);
//   });

