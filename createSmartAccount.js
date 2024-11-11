const {ethers} = require('ethers');
const { createSmartAccountClient } = require('@biconomy/account');
require("dotenv").config();

// Your configuration with private key and Biconomy API key
const config = {
  privateKey: "<Your-Private-Key>",
  bundlerUrl: process.env.BUNDLER_URL_BSC_TEST_NET, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
  rpcUrl: "https://data-seed-prebsc-1-s3.binance.org:8545/",
};

// Generate EOA from private key using ethers.js
let provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
let signer = new ethers.Wallet(config.privateKey, provider);

// Create Biconomy Smart Account instance
async function createSmartAccount(){
const smartWallet = await createSmartAccountClient({
  signer,
  bundlerUrl: config.bundlerUrl,
});

const saAddress = await smartWallet.getAccountAddress();
console.log("SA Address", saAddress);


}
// 0xFF052567B3E9f19CfD6a72aadd68B058d46cAC1b - Smart Wallet on Amoy
// 0xFF052567B3E9f19CfD6a72aadd68B058d46cAC1b - Smart Wallet on BSC 
createSmartAccount();