const {ethers} = require('ethers');
require("dotenv").config();
// const { createGasEstimator } = require("entry-point-gas-estimations");
const { createSmartAccountClient,PaymasterMode } = require('@biconomy/account');
 
       const privateKey =process.env.PVT_KEY2;
       const bundlerUrl = process.env.BUNDLER_URL_AMOY;// <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
       const rpcUrl = process.env.AMOY_RPC_URL;
       const biconomyPaymasterApiKey = process.env.BICONOMY_PAYMASTER_API_KEY_AMOY;

       let provider = new ethers.providers.JsonRpcProvider(rpcUrl);
       let signer = new ethers.Wallet(privateKey, provider);

  
const iface = new ethers.utils.Interface([
         "function transfer(address recipient, uint256 amount)"
     ]);
     
     // Define the recipient address and the amount to transfer (in smallest units, e.g., wei)
     const recipientAddress = "0x2f28e9C0B87eb65784e02441608db44175dB92CE"; //
     const amount = ethers.utils.parseUnits("10", 18); // Assuming 18 decimals
     
     // Encode the function data
     const encodedCall = iface.encodeFunctionData("transfer", [recipientAddress, amount]);

const tokenAddress = "0x264a0c8817c3317D17A5bb808F70423a028e3Fa2"; // Token Address 
const tx = {
  to: tokenAddress,
  data: encodedCall,
};


async function sendTransaction(){
const smartWallet = await createSmartAccountClient({
                  signer,
                  bundlerUrl,
                  biconomyPaymasterApiKey,
                });
 
const saAddress = await smartWallet.getAccountAddress();
console.log("SA Address", saAddress);


 
// Send the transaction and get the transaction hash
const userOpResponse = await smartWallet.sendTransaction(tx, {
         paymasterServiceData: { mode: PaymasterMode.SPONSORED },
       });

console.log("userOpResponse", userOpResponse);
       const { transactionHash } = await userOpResponse.waitForTxHash();
       console.log("Transaction Hash", transactionHash);
       const userOpReceipt = await userOpResponse.wait();
       if (userOpReceipt.success == "true") {
         console.log("UserOp receipt", userOpReceipt);
         console.log("Transaction receipt", userOpReceipt.receipt);
       }


}      

sendTransaction();