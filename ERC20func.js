const { ethers } = require("ethers");
require("dotenv").config();

 const provider = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC_URL);// Different for Different Network


const tokenAddress = "0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31"; // Address Of Token which the user will Import


const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
];

const tokenContract = new ethers.Contract(tokenAddress, abi, provider);

const walletAddress = "0xFF052567B3E9f19CfD6a72aadd68B058d46cAC1b"; // Account Address

async function getTokenDetails() {
    try {
        // Get the token symbol
        const symbol = await tokenContract.symbol();
        console.log(`Token Symbol: ${symbol}`);

        // Get the token decimals
        const decimals = await tokenContract.decimals();
        console.log(`Token Decimals: ${decimals}`);

        // Get the balance of the specified wallet
        const balance = await tokenContract.balanceOf(walletAddress);
        console.log(`Balance: ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`);
    } catch (error) {
        console.error("Error fetching token details:", error);
    }
}

// Fetch the token details
getTokenDetails();