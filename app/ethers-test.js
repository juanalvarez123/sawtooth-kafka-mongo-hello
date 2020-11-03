//https://hackernoon.com/a-closer-look-at-ethereum-signatures-5784c14abecc
//https://ethereum.stackexchange.com/questions/64380/understanding-ethereum-signatures

require('dotenv').config()

const { ethers } = require('ethers');
const secp256k1 = require('secp256k1')
const createKeccakHash = require('keccak')

//https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));


async function run (){
    let msg = "Hello world";
    let privateKey1 = "104b1cf90d4171c1b606e53ffe2f52c6f46320b06ef9c1a8fa01f5a0c4ca339a";
    
    const wallet = new ethers.Wallet("0x"+privateKey1);
    
    let signature1 = await wallet.signMessage(msg);
    
    const msgHash1 = ethers.utils.hashMessage(msg);
    const msgHash1Bytes = ethers.utils.arrayify(msgHash1);
    
    const recoveredPubKey = ethers.utils.recoverPublicKey(msgHash1Bytes, signature1);
    
    let publicKey1 = ethers.utils.computePublicKey(recoveredPubKey, true);
    publicKey1 = publicKey1.substring(2);

    // console.log('privateKey', privateKey);
    // console.log('publicKey', publicKey);

    let splitSig1 = ethers.utils.splitSignature(signature1);


    //-----------------
    //secp256k1
    //-----------------

    const pubKey = secp256k1.publicKeyCreate(Buffer.from(privateKey1, 'hex'))
    const privKey = Buffer.from(privateKey1, 'hex');

    buff = Buffer.concat([
        Buffer.from("\x19Ethereum Signed Message:\n", 'utf8'),
        Buffer.from(String(msg.length), 'utf8'),
        Buffer.from(msg)
    ]);
    msgHash2 = createKeccakHash('keccak256').update(buff).digest('hex');

    console.log(msgHash1.slice(2) === msgHash2);

    let result = secp256k1.ecdsaSign(fromHexString(msgHash1.slice(2)), privKey);
    signature2 = Buffer.from(result.signature).toString('hex')

    const privateKey2 = privKey.toString('hex');
    const publicKey2 = Buffer.from(pubKey).toString('hex');
    // console.log('privateKey', privateKey2);
    // console.log('publicKey', publicKey2);


    let splitSig2 = {}
    splitSig2.r = Buffer.from(result.signature.slice(0, 32)).toString('hex');
    splitSig2.s = Buffer.from(result.signature.slice(32, 64)).toString('hex');
    splitSig2.v = result.recid + 27


    //Comparisons
    console.log(privateKey1 === privateKey2);
    console.log(publicKey1 === publicKey2);

    console.log(splitSig1.r.slice(2) == splitSig2.r)
    console.log(splitSig1.s.slice(2) == splitSig2.s)
    console.log(splitSig1.v == splitSig2.v)

    console.log(signature1 ===  '0x' + signature2 + (splitSig2.v).toString(16))


    //secp256k1 recover from ethers signature
    let rpk = ethers.utils.recoverPublicKey(msgHash1Bytes, '0x' + signature2 + (splitSig2.v).toString(16));
    let rpublic = ethers.utils.computePublicKey(rpk, true);
    console.log(rpublic.slice(2) == publicKey1)

    const rpk2 = secp256k1.ecdsaRecover(result.signature, result.recid, fromHexString(msgHash1.slice(2)));
    let rpublic2 = Buffer.from(rpk2, 'hex').toString('hex')
    console.log(rpublic2 == publicKey1)

    const rpk3 = secp256k1.ecdsaRecover(Uint8Array.from(Buffer.from(signature1.slice(2, -2), 'hex')), parseInt(signature1.slice(-2), 16) - 27, fromHexString(msgHash1.slice(2)));
    let rpublic3 = Buffer.from(rpk3, 'hex').toString('hex')
    console.log(rpublic3 == publicKey1)

}

run();

