import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from "@solana/web3.js";

import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  createMint,
} from "@solana/spl-token";

// Import bs58 for Base58 encoding
import bs58 from 'bs58';

// Connect to Solana Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Admin Keypair (Use the keypair you already have or generate a new one)
const adminKeypair = Keypair.fromSecretKey(
  Uint8Array.from([
    75, 223, 111, 31, 93, 199, 87, 226, 140, 238, 228,
    180, 193, 32, 1, 92, 73, 76, 106, 40, 164, 216,
    37, 131, 190, 23, 200, 234, 111, 245, 23, 32, 171,
    47, 232, 116, 121, 16, 85, 147, 41, 217, 235, 170,
    129, 62, 100, 31, 215, 26, 101, 89, 72, 86, 132,
    131, 80, 19, 235, 38, 70, 211, 41, 78
  ])
);
       
const mintPublicKey1 = new PublicKey("498bK2F1fCNPsHWdTFiXr8dw51p3SAC4tHPzgRpDUo3j");
const mintPublicKey2 = new PublicKey("6tJrEXMyKN3AB6AMG89TnkegqiUDwKjqaeKkAxJt9amM");
const mintPublicKey3 = new PublicKey("n1EhuBLt5vjZxV3JRojEFUzZbJEdERt5sBXaJBVnXCM");//done
const mintPublicKey4 = new PublicKey("2tKPAw5tJZV6T9q8NrUTLcNzXrnxKHD6NxyHitURpSXj");
const mintPublicKey5 = new PublicKey("5EJnnu56ESrkaVtUBZqy4GHChGMEgwvNuQNqAzUivP63");//done 
const mintPublicKey6 = new PublicKey("2isDpn5Lz2C6qqtuNgjXfjuHiV9xA8P9MdMdSdyeZv48");



// Users Keypairs (Generate 3 users)
const user1 = Keypair.fromSecretKey(
  Uint8Array.from([
    214,  12,  29, 228, 128, 215,  13, 111, 215,  76, 216,
  243,  99, 174, 206,  49,  42, 145,  42, 196, 238, 164,
  155,  77,  63, 157, 242, 211,  48,  68, 236, 130, 158,
  186, 238, 207, 155, 253, 107, 154, 221,  49, 129, 243,
   77, 149, 250, 160, 222,  14,  84, 231,  31,  31, 118,
  110,  57, 147, 150, 229, 186, 107, 203,  69
  ])
);
const backendKeyPair =  Keypair.fromSecretKey(
  Uint8Array.from([
    99, 153, 185,   2, 176, 202, 136,  24,  48,  36,  90,
    13,  91,  36,  51, 211, 124,   5, 233,  93,  51, 220,
   224,  11, 254, 245,  14, 227,   0,  11,  18, 241, 209,
     4,  23, 171, 179, 194,  18, 176, 121, 103,  10, 192,
   157,  32,  23,  61, 105, 211,  36,  61,  96,   8,  12,
   131, 122, 122, 139, 206, 238, 217,  25,  54
  ])
);
const shortingKeyPair =  Keypair.fromSecretKey(
  Uint8Array.from([
    208,  97,  75,  90,  22,  81, 248,  53,  96, 145, 102,
    148,  23,  50, 250, 231, 200, 216, 213,  35,  24, 253,
    114, 165, 224,  39,  85, 241, 180, 153, 114, 250,  25,
     50, 244,  12, 169, 142, 175,  79,  40, 192,  10, 219,
    172,  30, 242,  24,  12,  36, 193,  79, 176, 202, 151,
     53,  87,  68,   1,  52, 105,  85,  94,  10
  ])
);

async function mintTokensToUser(userKeypair, mintPublicKey, amount) {
  try {
    // Get or create the associated token account
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair, // Payer of the transaction (use adminKeypair instead of userKeypair to avoid funding issues)
      mintPublicKey, // Mint
      userKeypair.publicKey // Owner of the token account
    );

    console.log(`Token account for user ${userKeypair.publicKey.toBase58()} is ${userTokenAccount.address.toBase58()}`);

    // Mint tokens to user's associated token account
    await mintTo(
      connection,
      adminKeypair, // The keypair that has authority over the mint
      mintPublicKey, // The mint address
      userTokenAccount.address, // The user's token account address
      adminKeypair, // The mint authority
      amount * 10 ** 6 // Adjust for decimals (e.g., for 6 decimals)
    );

    console.log(`Minted ${amount} tokens to ${userKeypair.publicKey.toBase58()}`);
    return userTokenAccount.address;

  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
}


async function checkUserTokenBalance(userTokenAccount) {
  const userTokenAccountInfo = await getAccount(connection, userTokenAccount);
  const userBalance = Number(userTokenAccountInfo.amount); // The balance is in smallest units (e.g., for 6 decimals, 1 token = 1000000)

  console.log(`User token balance: ${userBalance}`);
  return userBalance;
}

async function getOrCreateTokenAccount(userKeypair,mintPublicKey) {

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    userKeypair, // Payer of the transaction
    mintPublicKey, // Mint
    userKeypair.publicKey // Owner of the token account
  ); 

  // console.log("Token Account",tokenAccount);
  console.log("Token Account",tokenAccount.address);
  return tokenAccount;
}

async function checkSolBalance(publicKeyString) {
  try {
    // Convert the string to a PublicKey object
    const publicKey = new PublicKey(publicKeyString);

    // Get the balance (in lamports)
    const balance = await connection.getBalance(publicKey);

    // Convert lamports to SOL
    const solBalance = balance / LAMPORTS_PER_SOL;

    console.log(`Balance of ${publicKey.toBase58()}: ${solBalance} SOL`);
  } catch (err) {
    console.error('Error fetching balance:', err);
  }
}


async function main() {
  // console.log("Admin Key Pair", shortingKeyPair);
  // const privateKeyArray = Array.from(shortingKeyPair.secretKey);
  // console.log('Private Key Array:', privateKeyArray);

  // // Convert the private key array to a Base58 string for easier copying
  // const privateKeyBase58 = bs58.encode(shortingKeyPair.secretKey);
  // console.log('Base58 Encoded Private Key:', privateKeyBase58);

  // const publicKeyString = shortingKeyPair.publicKey.toBase58();
  // console.log("publicKeyString",publicKeyString);
  // // Display the public key
  // console.log('Public Key:', shortingKeyPair.publicKey.toBase58());

  // const publicKey = new PublicKey(publicKeyString);
  // await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);

  // You can now use the connection to interact with the Solana Devnet

  // Example: You can create a mint and mint tokens to users
  // const mintPublicKey = await createMint(...);
  // const userTokenAccount = await mintTokensToUser(user1, mintPublicKey, 1000);

  // console.log("User1 Key Pair",user1);
  
  // const backendTokenAccount = await getOrCreateTokenAccount(shortingKeyPair,mintPublicKey1);
  // console.log("oooooooooooooooooooooo",backendTokenAccount);

//   console.log("backendTokenAccount.address",backendTokenAccount.address);
//   const user1tokenBalanceBefore = await checkUserTokenBalance(backendTokenAccount.address);
// console.log("Before Balance",user1tokenBalanceBefore);
  await mintTokensToUser(user1,mintPublicKey1,100000);
  // console.log("Before Balance");

  // const user1tokenBalanceAfter = await checkUserTokenBalance(user1TokenAccount);
  // console.log("After Balance",user1tokenBalanceAfter);

  

}

main().catch(err => {
  console.error(err);
});




// Admin Key Pair Keypair {
//   _keypair: {
//     publicKey: Uint8Array(32) [
//       171,  47, 232, 116, 121,  16,  85, 147,
//        41, 217, 235, 170, 129,  62, 100,  31,
//       215,  26, 101,  89,  72,  86, 132, 131,
//        80,  19, 235,  38,  70, 211,  41,  78
//     ],
//     secretKey: Uint8Array(64) [
//        75, 223, 111,  31,  93, 199,  87, 226, 140, 238, 228,
//       180, 193,  32,   1,  92,  73,  76, 106,  40, 164, 216,
//        37, 131, 190,  23, 200, 234, 111, 245,  23,  32, 171,
//        47, 232, 116, 121,  16,  85, 147,  41, 217, 235, 170,
//       129,  62, 100,  31, 215,  26, 101,  89,  72,  86, 132,
//       131,  80,  19, 235,  38,  70, 211,  41,  78
//     ]
//   }
// }
// Private Key Array: [
//    75, 223, 111,  31,  93, 199,  87, 226, 140, 238, 228,
//   180, 193,  32,   1,  92,  73,  76, 106,  40, 164, 216,
//    37, 131, 190,  23, 200, 234, 111, 245,  23,  32, 171,
//    47, 232, 116, 121,  16,  85, 147,  41, 217, 235, 170,
//   129,  62, 100,  31, 215,  26, 101,  89,  72,  86, 132,
//   131,  80,  19, 235,  38,  70, 211,  41,  78
// ]
// Base58 Encoded Private Key: 2WyzDJjswKEz2dpjv5wCTvyVjJmjKoCQszyjNLigTWoJFKwBTdjYQmSeuDRVknWXYmo6FTyABueXonBt33hySg9T
// Public Key: CXF61iSwXdrzA829HBNpCmrLb4qPwpGfKGV6yE7yBYgD
