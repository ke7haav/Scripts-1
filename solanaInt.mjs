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
  TOKEN_2022_PROGRAM_ID,
  createMint,
  // findAssociatedTokenAddress,
  setAuthority,
  AuthorityType,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction
} from "@solana/spl-token";

// Import bs58 for Base58 encoding
import bs58 from 'bs58';

// Connect to Solana Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
// const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

// const connection = new Connection('https://floral-old-wind.solana-mainnet.quiknode.pro/<api-key-quickNode>', 'confirmed');

// Admin Keypair (Use the keypair you already have or generate a new one)
// const adminKeypair = Keypair.fromSecretKey(
//   Uint8Array.from([
 
//   ])
// );

const adminKeypair = Keypair.fromSecretKey( // My Phantom Walet
  Uint8Array.from([
  ])
)
     
const mintPublicKey= new PublicKey('4V1DfZ2DUw5iw3s8bKGyU1BktewBge6XcUusmwrYaQvD');
const mintPublicKey1 = new PublicKey("498bK2F1fCNPsHWdTFiXr8dw51p3SAC4tHPzgRpDUo3j");
const mintPublicKey2 = new PublicKey("6tJrEXMyKN3AB6AMG89TnkegqiUDwKjqaeKkAxJt9amM");
const mintPublicKey3 = new PublicKey("n1EhuBLt5vjZxV3JRojEFUzZbJEdERt5sBXaJBVnXCM");//done
const mintPublicKey4 = new PublicKey("2tKPAw5tJZV6T9q8NrUTLcNzXrnxKHD6NxyHitURpSXj");
const mintPublicKey5 = new PublicKey("5EJnnu56ESrkaVtUBZqy4GHChGMEgwvNuQNqAzUivP63");//done 
const mintPublicKey6 = new PublicKey("2isDpn5Lz2C6qqtuNgjXfjuHiV9xA8P9MdMdSdyeZv48");



// Users Keypairs (Generate 3 users)
const user1 = Keypair.fromSecretKey(
  Uint8Array.from([
  ])
);
const backendKeyPair =  Keypair.fromSecretKey(
  Uint8Array.from([
  ])
);
const shortingKeyPair =  Keypair.fromSecretKey(
  Uint8Array.from([
  ])
);

const senderPublicKey = new PublicKey('6eYBVKFtyVMMbNiggJLHBEbYmeaqU9q7nRFjhaeawCXW')
async function mintTokensToUser(userPublicKey, mintPublicKey, amount) {

  try {
    const senderTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,        // Token mint address
      senderPublicKey,      // User's wallet address
      false,              // Set to false for non-multisig wallets
      TOKEN_2022_PROGRAM_ID  //Specify the new token program ID
    );


    console.log("senderTokenAccount",senderTokenAccount);
    // const accountInfo = await getAccount(connection, senderTokenAccount, TOKEN_2022_PROGRAM_ID);

    // console.log("accountInfo",accountInfo);


        // const createATAInstruction = createAssociatedTokenAccountInstruction(
        //   adminKeypair.publicKey,    // Payer (to pay for the account creation)
        //      senderTokenAccount, // Associated token account
        //      senderPublicKey,      // Owner of the token account
        //      mintPublicKey,        // Mint address
        //      TOKEN_2022_PROGRAM_ID    //Specify the new token program ID
        //      );
           
        // // console.log('createATAInstruction',createATAInstruction);
        //     //  Create a transaction and add the instruction
        //      const ATAtransaction = new Transaction().add(createATAInstruction);
           
        // // console.log('ATAtransaction',ATAtransaction);
        //      // Sign and send the transaction
        //      const signature = await sendAndConfirmTransaction(connection, ATAtransaction, [adminKeypair]);
        //      console.log(signature);


    const transactionSignature = await mintTo(
      connection,
      adminKeypair, // Transaction fee payer
      mintPublicKey, // Mint Account address
      senderTokenAccount, // Mint to
      adminKeypair.publicKey, // Mint Authority address
      20000000000000, // Amount
      undefined, // Additional signers
      undefined, // Confirmation options
      TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    console.log(transactionSignature);

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
  // const userPublicKey = new PublicKey('BgcjxR8ewRAmzmgbndaVJsKXRPxvjbvTrup1MXLV8DBS');
  const senderPublicKey = new PublicKey('CXF61iSwXdrzA829HBNpCmrLb4qPwpGfKGV6yE7yBYgD');
  // await mintTokensToUser(senderPublicKey,mintPublicKey1,100000);
  // await mintTokensToUser(userPublicKey,mintPublicKey2,100000);

  const mintAuthortyPublicKey = new PublicKey('Fn89RnaDENw6BKMUQvTfLdpa4aipddGqoKsoJisy75EU')
  await mintTokensToUser(mintAuthortyPublicKey,mintPublicKey,10000);
  // console.log("Before Balance");

  // const user1tokenBalanceAfter = await checkUserTokenBalance(user1TokenAccount);
  // console.log("After Balance",user1tokenBalanceAfter);

  

}

main().catch(err => {
  console.error(err);
});


                               