//https://hackernoon.com/a-closer-look-at-ethereum-signatures-5784c14abecc
//https://ethereum.stackexchange.com/questions/64380/understanding-ethereum-signatures

require('dotenv').config()
const HOST = process.env.SAWTOOTH_HOST;

const { ethers } = require('ethers');
const secp256k1 = require('secp256k1')
const createKeccakHash = require('keccak')
const cbor = require('cbor')
const {createHash} = require('crypto')
const crypto = require('crypto')
const {protobuf} = require('sawtooth-sdk')

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



async function run (){
    let msg = "Hello world";
    let privateKey1 = "104b1cf90d4171c1b606e53ffe2f52c6f46320b06ef9c1a8fa01f5a0c4ca339a";

    const wallet = new ethers.Wallet("0x"+privateKey1);
    
    let signature1 = await wallet.signMessage(msg);
    
    const msgHash1 = ethers.utils.hashMessage(msg);
    const msgHash1Bytes = ethers.utils.arrayify(msgHash1);
    
    const recoveredPubKey = ethers.utils.recoverPublicKey(msgHash1Bytes, signature1);
    
    let publicKey1 = ethers.utils.computePublicKey(recoveredPubKey, true);
    publicKey = publicKey1.substring(2);

    console.log('publicKey', publicKey)


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

    let result = await wallet.signMessage(dataHash);
    let signature = result.slice(2, -2)
    console.log('sha1:', createHash('sha512').update(transactionHeaderBytes).digest('hex'))
    console.log('signature1:', signature)
    console.log(result)
    
}

run();

