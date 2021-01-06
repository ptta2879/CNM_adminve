require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks:{
    kovan:{
      provider: function(){
       return new HDWalletProvider(
         process.env.NMEMONIC,
        `https://kovan.infura.io/v3/be4ca854504647adbc9649897b72a5a6`
        )
      } ,
      gasPrice: 25000000000,
      network_id: 42
    },
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}