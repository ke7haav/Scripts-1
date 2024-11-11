const { ethers } = require('ethers');


const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');

const recipientAddress = '0x95E270Ef64960DCf6d6583479CDe14dE31D420Af';

const privateKey = '';

const wallet = new ethers.Wallet(privateKey, provider);

// Convert message to hex
const message = "First On-Chain Message through Scripts";
const hexData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)); 

// Get the current gas price
const sendTransactionW = async () => {
  try {
    // Get current fee data
    const feeData = await provider.getFeeData();

    // Estimate the gas limit for the transaction
    const estimatedGasLimit = await provider.estimateGas({
      to: recipientAddress,
      data: hexData,
    });

    // Calculate max fee and priority fee
    const maxFeePerGas = feeData.maxFeePerGas || ethers.utils.parseUnits('0.003608618', 'gwei');
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('0.005608618', 'gwei');

    // Create the transaction
    const tx = {
      to: recipientAddress,
      value: ethers.utils.parseEther('0.0'), // Sending 0 ether
      data: hexData,
      // gasLimit: 21608,
      // maxFeePerGas: maxFeePerGas,
      // maxPriorityFeePerGas: maxPriorityFeePerGas,
    };

    const transactionCost = maxFeePerGas.mul(estimatedGasLimit);
    console.log("Estimated Max Fee Per Gas (Wei):", maxFeePerGas.toString());
    console.log("Estimated Priority Fee Per Gas (Wei):", maxPriorityFeePerGas.toString());
    console.log("Estimated Gas Limit:", estimatedGasLimit.toString());
    console.log("Estimated Transaction Cost (Wei):", transactionCost.toString());

    const transactionResponse = await wallet.sendTransaction(tx,{
      gasPrice: ethers.utils.parseUnits('0.003', 'gwei'), // Set a higher gas price
      gasLimit: 21608 
    });
    await transactionResponse.wait();

    console.log(`Transaction sent with hash: ${transactionResponse.hash}`);
    // console.log(`You can view the transaction on Etherscan: https://etherscan.io/tx/${transactionResponse.hash}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

async function simulate(){
  const gasPrice = ethers.utils.parseUnits('0.005', 'gwei'); // Example for a lower gas price
  const gasLimit = await provider.estimateGas({
    to: recipientAddress,
    data: messageData
});

const adjustedGasLimit = gasLimit.mul(110).div(100); // 10% buffer

const tx = {
    to: recipientAddress,
    data: messageData,
    gasPrice: gasPrice, // You can adjust this value
    gasLimit: adjustedGasLimit
};

const transaction = await wallet.sendTransaction(tx);
await transaction.wait();

console.log('Transaction sent:', transaction.hash);

}



sendTransactionW().catch(error => {
  console.error(error);
});


// const privateKey = '';

// Estimated fee
// $0.00
// 0.0000002ETH
// Market

// ~60 sec

// Max fee:
// 0.00000044ETH

// Layer 2 fees
// $0.00
// 0.00000015ETH

// Layer 1 fees
// $0.00
// 0.00000005ETH

