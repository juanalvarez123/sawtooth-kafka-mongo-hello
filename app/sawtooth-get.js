require('dotenv').config();

const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const axios = require('axios');
const context = createContext('secp256k1')
const crypto = require('crypto');

const HOST = process.env.SAWTOOTH_HOST;

const hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const TP_FAMILY = 'tp1'
const TP_NAMESPACE = hash(TP_FAMILY).substring(0, 6)

const address = (k) => TP_NAMESPACE + hash(k).slice(-64)

const payload = {
  authorizationId: '1085277715'
}

axios({
  method: 'get',
  url: `${HOST}/state/${address(payload.authorizationId)}`,
  headers: {'Content-Type': 'application/json'}
})
.then(function (response) {
  console.log('address:', address(payload.authorizationId))

  let base = Buffer.from(response.data.data, 'base64');
  let stateValue = JSON.parse(base, 'utf-8');

  console.log(stateValue);
})
.catch(err => {
  console.log(err);
});
