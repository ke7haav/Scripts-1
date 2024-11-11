const solanaWeb3 = require('@solana/web3.js');
const bs58 = require('bs58');
require("dotenv").config();

// Define connection to the Solana network
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// Define the recipient address and the sender private key
const recipientAddress = new solanaWeb3.PublicKey('CkWwdm71muMUKF3dGYKhPyFfdaCBTpnDpKKDmHvUndtE');
const secretKey = Uint8Array.from(bs58.decode(process.env.PVT_KEY_SOL));

// Create a keypair from the secret key
const senderKeypair = solanaWeb3.Keypair.fromSecretKey(secretKey);

// const airdropSOL = async (publicKey, amount) => {
//   const airdropSignature = await connection.requestAirdrop(
//     publicKey,
//     amount * solanaWeb3.LAMPORTS_PER_SOL
//   );

//   await connection.confirmTransaction(airdropSignature);
// };

const checkBalances = async () => {
  const senderBalance = await connection.getBalance(senderKeypair.publicKey);
  const recipientBalance = await connection.getBalance(recipientAddress);

  console.log(`Sender balance: ${senderBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
  console.log(`Recipient balance: ${recipientBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
};

const sendTransaction = async () => {
  // Create a transaction
  let transaction = new solanaWeb3.Transaction();

  // Create a transfer instruction
  const instruction = solanaWeb3.SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: recipientAddress,
    lamports: 0, // Amount in lamports (1 lamport = 10^-9 SOL)
  });

  // Add the instruction to the transaction
  transaction.add(instruction);

  // Add a memo with the message (optional)
  const message = 'MassChain Overview MassChain pioneers a novel approach to blockchain marketing while safeguarding investors against pump and dump schemes and scams.Marketing is crucial for any product, the same goes for low market cap tokens seeking to attract investors and enhance liquidity, thereby influencing the price. However, navigating the saturated marketplace and accessing effective marketing channels such as influencers or large-scale campaigns can be challenging.At MassChain, we provide a reliable outlet for token owners seeking exposure. We prioritize investor protection by selectively showcasing tokens that demonstrate promising potential, supported by a team of top analysts.Token applicants must adhere strictly to our guidelines for consideration. Failure to meet our standards will result in exclusion from showcase opportunity.For investors, whether experienced or novice, navigating the complexities of crypto assets can be daunting and time-consuming. Our goal is to';
  const memoInstruction = new solanaWeb3.TransactionInstruction({
    keys: [{ pubkey: senderKeypair.publicKey, isSigner: true, isWritable: true }],
    programId: new solanaWeb3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    data: Buffer.from(message),
  });

  transaction.add(memoInstruction);

  // Send the transaction
  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

  // Fetch transaction details to get fee information
  const transactionDetails = await connection.getTransaction(signature, 'confirmed');
  const fee = transactionDetails.meta.fee / solanaWeb3.LAMPORTS_PER_SOL;

  console.log(`Transaction sent with signature: ${signature}`);
  console.log(`Transaction fee: ${fee} SOL`);
  console.log(`You can view the transaction on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=mainnet`);
};

const main = async () => {
  await checkBalances();

  const recipientBalance = await connection.getBalance(recipientAddress);
  if (recipientBalance === 0) {
    console.log('Airdropping 1 SOL to the recipient account to cover rent-exempt minimum...');
    await airdropSOL(recipientAddress, 1);
  }

  await sendTransaction();
};

main().catch(error => {
  console.error(error);
});
