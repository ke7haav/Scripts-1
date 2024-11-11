const {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction
} = require('@solana/web3.js');

const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_PROGRAM_ID
} = require('@solana/spl-token');

// Connect to Solana Devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Replace these with your actual keypairs
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from([
  99, 153, 185,   2, 176, 202, 136,  24,  48,  36,  90,
  13,  91,  36,  51, 211, 124,   5, 233,  93,  51, 220,
 224,  11, 254, 245,  14, 227,   0,  11,  18, 241, 209,
   4,  23, 171, 179, 194,  18, 176, 121, 103,  10, 192,
 157,  32,  23,  61, 105, 211,  36,  61,  96,   8,  12,
 131, 122, 122, 139, 206, 238, 217,  25,  54
]));

const receiverPublicKey = new PublicKey('BgcjxR8ewRAmzmgbndaVJsKXRPxvjbvTrup1MXLV8DBS'); // Replace with the receiver's public key

const mintPublicKey1 = new PublicKey("498bK2F1fCNPsHWdTFiXr8dw51p3SAC4tHPzgRpDUo3j");

function sendSPLTokens() {
  getOrCreateAssociatedTokenAccount(
    connection,
    senderKeypair, // Payer of the transaction
    mintPublicKey1, // Mint
    senderKeypair.publicKey // Owner of the token account
  ).then(function (senderTokenAccount) {

    getOrCreateAssociatedTokenAccount(
      connection,
      senderKeypair, // Payer of the transaction
      mintPublicKey1, // Mint
      receiverPublicKey // Owner of the token account
    ).then(function (receiverTokenAccount) {

      // Create the transfer instruction
      const transferInstruction = createTransferInstruction(
        senderTokenAccount.address, // Source account (sender's token account)
        receiverTokenAccount.address, // Destination account (receiver's token account)
        senderKeypair.publicKey, // Owner of the source account (sender)
        1000000, // Amount to transfer (in the smallest units, e.g., 1 token if 6 decimals)
        [], // Signers (if any additional ones are required)
        TOKEN_PROGRAM_ID // SPL Token Program ID
      );

      // Create a transaction and add the transfer instruction
      const transaction = new Transaction().add(transferInstruction);

      // Sign and send the transaction
      sendAndConfirmTransaction(connection, transaction, [senderKeypair]).then(function (signature) {
        console.log('Transaction confirmed with signature:', signature);
      }).catch(function (error) {
        console.error('Error sending SPL tokens:', error);
      });

    }).catch(function (error) {
      console.error('Error getting or creating receiver token account:', error);
    });

  }).catch(function (error) {
    console.error('Error getting or creating sender token account:', error);
  });
}

sendSPLTokens();
