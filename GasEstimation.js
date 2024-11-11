const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL); 
const tokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // Address Of Token which the user will Import
const tokenDistributer = "0xc3beDCFa051eB22a2B3d1C06e26E8cE48E034686";
const nftAddress = "0xb2F649924d6e3733fC43368D3a4ee00bFC9f3e6F"; 


const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 value) external returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function distribute(address to, uint256 amount, address _token)",
    "function transferFrom(address from, address to, uint256 tokenId) external",
];

const nftContract = new ethers.Contract(nftAddress, abi, provider);
const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
const distributerContract = new ethers.Contract(tokenDistributer,abi,provider)


const privateKey = "<Private-Key>"; // Replace with your wallet's private key
const wallet = new ethers.Wallet(privateKey, provider);
const tokenWithSigner = tokenContract.connect(wallet);
const distributerContractSigner = distributerContract.connect(wallet);
const tokenSignerNFT = nftContract.connect(wallet);
const adminWalletAddress = "0x67d5e83348A2b80F8291EA6646a67A591da959c7";



async function txGasEstimation(to, amount){
    const decimals = await tokenContract.decimals();

    // Format the amount to the correct number of decimals
    const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);

    // Calculate 99% and 1% of the amount
    const recipientAmount = amountInWei.mul(99).div(100); // 99%
    const adminAmount = amountInWei.sub(recipientAmount); // 1%


    const gasEstimate1 = await tokenWithSigner.estimateGas.transfer(to, recipientAmount);
    const gasEstimate2 = await tokenWithSigner.estimateGas.transfer(adminWalletAddress, adminAmount);
    const totalGasEstimate = gasEstimate1.add(gasEstimate2);
    console.log(`Estimated Total Gas(Ethers): ${totalGasEstimate.toString()}`);

    
    const gasPrice = await provider.getGasPrice();
    console.log("Current Gas Price (in wei):", gasPrice.toString());

    const totalGasCost = totalGasEstimate.mul(gasPrice);
    console.log(`Total Gas Cost (in wei) Using Ethers: ${totalGasCost.toString()}`);

    // Check user's ETH balance
    const ethBalance = await wallet.getBalance();
    console.log(`User's ETH Balance (in wei): ${ethBalance.toString()}`);


}

 async function smartxGasEstimation(to,amount){

    const gasEstimate1 = await tokenWithSigner.estimateGas.approve(tokenDistributer, amount);
    console.log(tokenContract.address == tokenAddress);
    const gasEstimate2 = await distributerContractSigner.estimateGas.distribute(to, amount,tokenAddress);

    // console.log(`Estimated Approval Gas : ${gasEstimate1.toString()}`)

    const totalGasEstimate = gasEstimate1.add(gasEstimate2);
    console.log(`Estimated Total Gas (Smart Contract): ${totalGasEstimate.toString()}`);

    const gasPrice = await provider.getGasPrice();
    console.log("Current Gas Price (in wei):", gasPrice.toString());
    
    const totalGasCost = totalGasEstimate.mul(gasPrice);
    console.log(`Total Gas Cost (in wei) Using Smart Contract: ${totalGasCost.toString()}`);

    // Check user's ETH balance
    const ethBalance = await wallet.getBalance();
    console.log(`User's ETH Balance (in wei): ${ethBalance.toString()}`);

}

async function gasEstimationNFTTransfer(from,to,tokenID){

    const gasEstimateNFTTransfer = await tokenSignerNFT.estimateGas.transferFrom(from,to,tokenID);

    console.log("Gas Used in NFT Transfer",gasEstimateNFTTransfer.toString());

    const gasPrice = await provider.getGasPrice();
    console.log("Current Gas Price (in wei):", gasPrice.toString());

    const totalGasCost = gasEstimateNFTTransfer.mul(gasPrice);
    console.log(`Total Gas Cost (in wei) for NFT Transfer: ${totalGasCost.toString()}`);

       // Check user's ETH balance
       const ethBalance = await wallet.getBalance();
       console.log(`User's ETH Balance (in wei): ${ethBalance.toString()}`);
   

}

const recipientAddress = "0x95E270Ef64960DCf6d6583479CDe14dE31D420Af"; // Replace with the recipient's address
const transferAmount = 10; // Amount of tokens to transfer
// txGasEstimation(recipientAddress, transferAmount);

// smartxGasEstimation(recipientAddress, transferAmount)

const from = "0x25E103D477025F9A8270328d84397B2cEE32D0BF";
const to = "0x95E270Ef64960DCf6d6583479CDe14dE31D420Af"; 
const tokenID = 2; 
gasEstimationNFTTransfer(from,to,tokenID);

