const {ethers} = require('ethers');
require("dotenv").config();
const { createGasEstimator } = require("entry-point-gas-estimations");
const { createSmartAccountClient,PaymasterMode } = require('@biconomy/account');
 
       const privateKey =process.env.PVT_KEY2;
       const bundlerUrl = process.env.BUNDLER_URL_BSC_TEST_NET;// <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
       const rpcUrl = process.env.BSC_TESTNET_RPC_URL;
       const biconomyPaymasterApiKey = process.env.BICONOMY_PAYMASTER_API_KEY_BSC_TESTNET;

       let provider = new ethers.providers.JsonRpcProvider(rpcUrl);
       let signer = new ethers.Wallet(privateKey, provider);

  
const iface = new ethers.utils.Interface([
         "function transfer(address recipient, uint256 amount)"
     ]);
     
     // Define the recipient address and the amount to transfer (in smallest units, e.g., wei)
     const recipientAddress = "0x25E103D477025F9A8270328d84397B2cEE32D0BF"; // Our Backend Address at which we will receive 1.5 AVT token
     const amount = ethers.utils.parseUnits("1.5", 18); // Assuming 18 decimals
     
     // Encode the function data
     const encodedCall = iface.encodeFunctionData("transfer", [recipientAddress, amount]);

const tokenAddress = "0x5A1Be0230A5C8A6f4278637d7f3A48B8ADBa4104"; // AVT Token Address on BNB 
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