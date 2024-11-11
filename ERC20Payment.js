const {ethers} = require('ethers');
require("dotenv").config();
const { createSmartAccountClient,PaymasterMode } = require('@biconomy/account');
 
       const privateKey =process.env.PVT_KEY2;
       const bundlerUrl = process.env.BUNDLER_URL;// <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
       const rpcUrl = process.env.AMOY_RPC_URL;
       const biconomyPaymasterApiKey = process.env.BICONOMY_PAYMASTER_API_KEY;

       let provider = new ethers.providers.JsonRpcProvider(rpcUrl);
       let signer = new ethers.Wallet(privateKey, provider);


const iface = new ethers.utils.Interface([
        "function safeMint(address _to)"
       ]);
       
       const encodedCall = iface.encodeFunctionData("safeMint", ["0x95E270Ef64960DCf6d6583479CDe14dE31D420Af"]);

const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
const transaction = {
  to: nftAddress,
  data: encodedCall,
};


async function sendTransaction(){

  
const smartWallet = await createSmartAccountClient({
         signer, // can be viem client or ethers signer
         bundlerUrl,
         biconomyPaymasterApiKey,
       });

const feeQuotesResponse = await smartWallet.getTokenFees(transaction, {
  paymasterServiceData: { mode: PaymasterMode.ERC20 },
});

console.log("feeQuotesResponse",feeQuotesResponse);
const userSelectedFeeQuote = feeQuotesResponse.feeQuotes?.[0]; 
console.log("userSelectedFeeQuote",userSelectedFeeQuote);

// const { wait } = await smartWallet.sendTransaction(transaction, {
//          paymasterServiceData: {
//            mode: PaymasterMode.ERC20,
//            preferredToken: "0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31",
//          },
//        });

//        console.log(await wait());
}      

sendTransaction();


//    Create a gas estimator instance
//    const gasEstimator = createGasEstimator({ rpcUrl });

//    const PayMasterAndData = "0x00000f79b7faf42eebadba19acc07cd08af4478900000000000000000000000025e103d477025f9a8270328d84397b2cee32d0bf0000000000000000000000000000000000000000000000000000000066b9d4e30000000000000000000000000000000000000000000000000000000066b9cddb0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000004165944861e3b323ba7d169b99f7ea7062c6daa38005d31e82bc4ca718ae8b184419f094a7c8659fa71e5fbd2ec791f45d155092109f2f7346e029f3502a2900a31b00000000000000000000000000000000000000000000000000000000000000"
                             
                            
//    // Construct the UserOperation object
//    const userOperation = {
//          sender: saAddress,
//          nonce: BigInt(10), // Ensure this is a BigInt
//          initCode: "0x", // This should be populated if needed, otherwise left as "0x"
//          callData: encodedCall,
//          callGasLimit: BigInt(1000000), // Example value, adjust as needed
//          verificationGasLimit: BigInt(1000000), // Example value, adjust as needed
//          preVerificationGas: BigInt(50000), // Example value, adjust as needed
//          maxFeePerGas: ethers.utils.parseUnits("20", "gwei").toBigInt(), // Example value, adjust as needed
//          maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei").toBigInt(), // Example value, adjust as needed
//          paymasterAndData: PayMasterAndData,
//          signature: "0x" + "0".repeat(130), // Dummy signature
//      };

//    console.log("After userOperation")
//    const estimateUserOperationGasResponse = await gasEstimator.estimateUserOperationGas({
//        userOperation,
//    });

//    console.log("Gas Estimation Response:", estimateUserOperationGasResponse);