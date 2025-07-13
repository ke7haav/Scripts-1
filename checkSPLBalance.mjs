import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

// Replace with your wallet address and token mint address
const WALLET_ADDRESS = "8SBqcMToF5sonKFjYRopcV81YfzGQUjBTemFLFQY4t7c";
const TOKEN_MINT_ADDRESS = "HDd5mbaUmsSiE18pMKM4bks4FtfkDBVHtib7NNkP5cpA";

// const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
const connection = new Connection("https://api.devnet.solana.com", "confirmed");


// Function to get SPL token balance
async function getSPLTokenBalance(walletAddress, tokenMintAddress) {
  try {

    // Convert addresses to PublicKey format
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);

    // Find the associated token account
    const associatedTokenAccount = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      walletPublicKey,
      false, // Not multisig
      TOKEN_2022_PROGRAM_ID
    );

    console.log("Associated Token Account:", associatedTokenAccount.toBase58());

    // Fetch the token account info
    const tokenAccountInfo = await getAccount(connection, associatedTokenAccount);
    console.log("Here")
    // const vaultPDA = new PublicKey('5phhyHybThgnf9GN4DcQNR7oKNe3vaX6gbQktDRcTASA')

    const info = await connection.getTokenAccountBalance(tokenAccountInfo);
    console.log("Info",info);
    // Get token balance (convert from raw to readable format)
    // const tokenBalance = tokenAccountInfo.amount;
    // console.log(`SPL Token Balance: ${tokenBalance} tokens`);

  } catch (error) {
    console.error("Error fetching SPL token balance:", error.message);
  }
}

// Run the function
getSPLTokenBalance(WALLET_ADDRESS, TOKEN_MINT_ADDRESS);
