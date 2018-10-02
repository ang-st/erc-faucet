const ApiBuilder = require('claudia-api-builder')
const contract =  require("truffle-contract")
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('web3')
const path = require("path")

const api = new ApiBuilder()
module.exports = api

let isAddress = Web3.utils.isAddress
let contractAbi = require("./contracts/TestToken.json")
let provider = new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/" + process.env.INFURA_API_KEY,0)
let Contract = contract(contractAbi)
Contract.setProvider(provider)

api.post('faucet', (req)=>{
  let address = req.body.address
  if(!isAddress(address)){
      throw new ApiBuilder.ApiResponse('Invalid Ethereum address', {'Content-Type': 'application/json'}, 500)
  }
  Contract.deployed()
  .then(instance=>{
    return instance.mint(address, 10*10e18) // 100 TestToken
  })
  .then(result =>{
    return {txid: result.tx}
  })
  .catch( error => {
       new ApiBuilder.ApiResponse(error.message, {'Content-Type': 'application/json'}, 500)
  })
  
})

