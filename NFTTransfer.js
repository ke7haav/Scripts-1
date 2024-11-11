const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/<API-KEY>'); // Different for Different Network


const nftAddress = "0xb2F649924d6e3733fC43368D3a4ee00bFC9f3e6F"; // Address Of Token which the user will Import


const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 tokenId) external",
];

const nftContract = new ethers.Contract(nftAddress, abi, provider);

const privateKey = "Private-Key"; // Private Key Of the Address from which we are going to do the transaction 
const wallet = new ethers.Wallet(privateKey, provider);
const tokenWithSigner = nftContract.connect(wallet);

async function nftTransfer(from,to, tokenID) {
    try {
       
        // Send the transfer transaction to the recipient
        const tx1 = await tokenWithSigner.transferFrom(from,to,tokenID);
        console.log(`Transaction hash (recipient): ${tx1.hash}`);
        await tx1.wait(); // Wait for the transaction to be mined
        console.log("NFT Transfer Sucessful");

    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

const from = "0x25E103D477025F9A8270328d84397B2cEE32D0BF";
const to = "0x95E270Ef64960DCf6d6583479CDe14dE31D420Af"; 
const tokenID = 2; 
nftTransfer(from, to,tokenID);
