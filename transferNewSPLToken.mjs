import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createTransferCheckedInstruction, TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddress,createAssociatedTokenAccountInstruction} from "@solana/spl-token";
import bs58 from "bs58";

// Connection to Solana Devnet (change to Mainnet if required)
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
// const connection = new Connection('http://127.0.0.1:8899', 'confirmed');


// Define keypair for sender (replace with actual private key)
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from([
                 ])); // My KeyPair 



// Define public key for receiver (replace with actual public key)
const receiverPublicKey = new PublicKey("3bLntjnrCBbgUi4nYY79tewvEfX2Uhu95UdHyTfv6g4U");

// Define token mint address (replace with actual mint address)
const mintPublicKey = new PublicKey("4V1DfZ2DUw5iw3s8bKGyU1BktewBge6XcUusmwrYaQvD");

// Amount to transfer (in smallest unit, considering decimals)
const amount =27525060; // Example: 1 token if decimals = 6

// Function to transfer new SPL token
async function transferNewSPLToken() {
  try {
    // Get sender's associated token account
    const senderTokenAccount = await getAssociatedTokenAddress(
         mintPublicKey,        // Token mint address
         senderKeypair.publicKey,      // User's wallet address
         false,              // Set to false for non-multisig wallets
         TOKEN_2022_PROGRAM_ID  //Specify the new token program ID
       );

    // Get receiver's associated token account
    // const receiverTokenAccount = await getAssociatedTokenAddress(
    //   mintPublicKey,
    //   receiverPublicKey,
    //   false, // Not multisig
    //   TOKEN_2022_PROGRAM_ID
    // );
   
const receiverTokenAccount = new PublicKey("GqJ3sXT33Dzw4gyZRRZMaTPfeS6njAMSsfJpecXau1B3");
    const accountInfo = await connection.getAccountInfo(receiverTokenAccount);
    // console.log("accountInfo",accountInfo);
       // const accountInfo = await getAccount(connection, senderTokenAccount, TOKEN_2022_PROGRAM_ID);
   
       // console.log("accountInfo",accountInfo);
   
   
        //    const createATAInstruction = createAssociatedTokenAccountInstruction(
        //  senderKeypair.publicKey,    // Payer (to pay for the account creation)
        //      receiverTokenAccount, // Associated token account
        //      receiverPublicKey,      // Owner of the token account
        //         mintPublicKey,        // Mint address
        //         TOKEN_2022_PROGRAM_ID    //Specify the new token program ID
        //         );
              
        //    console.log('createATAInstruction',createATAInstruction);senderKeypair
        //         // Create a transaction and add the instruction
        //         const ATAtransaction = new Transaction().add(createATAInstruction);
              
        //    console.log('ATAtransaction',ATAtransaction);
        //         // Sign and send the transaction
        //         const signature = await sendAndConfirmTransaction(connection, ATAtransaction, [senderKeypair]);
        //         console.log(signature);

    console.log("Sender Token Account:", senderTokenAccount.toBase58());
    console.log("Receiver Token Account:", receiverTokenAccount.toBase58());

    // Create the transfer instruction
    const transferInstruction = createTransferCheckedInstruction(
      senderTokenAccount,       // Sender's token account
      mintPublicKey,            // Mint address
      receiverTokenAccount,     // Receiver's token account
      senderKeypair.publicKey,  // Owner of sender's token account
      amount,                   // Amount to transfer
      6,                        // Decimals (replace with your token's decimals)
      [],                       // Signers (empty for non-multisig)
      TOKEN_2022_PROGRAM_ID     // Program ID for Token-2022
    );

    // Create transaction and add the instruction
    const transaction = new Transaction().add(transferInstruction);

    // console.log("Transaction",transaction);
    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
    console.log("Transaction confirmed with signature:", signature);
  } catch (error) {
    console.error("Error transferring new SPL token:", error);
  }
}

transferNewSPLToken();
