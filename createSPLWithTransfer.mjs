import {
         Connection,
         Keypair,
         SystemProgram,
         Transaction,
         clusterApiUrl,
         sendAndConfirmTransaction,
       } from "@solana/web3.js";
       import {
         ExtensionType,
         TOKEN_2022_PROGRAM_ID,
         createAccount,
         createInitializeMintInstruction,
         createInitializeTransferFeeConfigInstruction,
         getMintLen,
         getTransferFeeAmount,
         harvestWithheldTokensToMint,
         mintTo,
         transferCheckedWithFee,
         unpackAccount,
         withdrawWithheldTokensFromAccounts,
         withdrawWithheldTokensFromMint,
         createInitializeMetadataPointerInstruction,
         TYPE_SIZE,
         LENGTH_SIZE
       } from "@solana/spl-token";
import {createInitializeInstruction,createUpdateFieldInstruction} from "@solana/spl-token-metadata";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');


const payer =Keypair.fromSecretKey(Uint8Array.from([
        
       ]));
const mintAuthority = Keypair.fromSecretKey(Uint8Array.from([
     
       ]));
const mintKeyPair = Keypair.generate();
const mintPubKey = mintKeyPair.publicKey;

//Authority that can modify the transfer Fee 
const transferFeeConfigAuthority =  Keypair.fromSecretKey(Uint8Array.from([
       
       ]));

//Authority that can move withheld token to either mint or any Token Accounts 
const withdrawWithheldAuthority =  Keypair.fromSecretKey(Uint8Array.from([
       
       ]));

const decimals = 6;
const feeBasisPoints = 1000; 
const maxFee = BigInt(1000000n);


async function createSPLTokenWithTransferFee() {

// const mintLen = getMintLen([ExtensionType.TransferFeeConfig,ExtensionType.MetadataPointer]);
const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);

      
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
console.log("lamports Req",lamports);



// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
  newAccountPubkey: mintPubKey, // Address of the account to create
  space: mintLen, // Amount of bytes to allocate to the created account
  lamports, // Amount of lamports transferred to created account
  programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
});

const initializeTransferFeeConfig =
  createInitializeTransferFeeConfigInstruction(
    mintPubKey, // Mint Account address
    transferFeeConfigAuthority.publicKey, // Authority to update fees
    withdrawWithheldAuthority.publicKey, // Authority to withdraw fees
    feeBasisPoints, // Basis points for transfer fee calculation
    maxFee, // Maximum fee per transfer
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );

// Instruction to initialize Mint Account data
const initializeMintInstruction = createInitializeMintInstruction(
  mintPubKey, // Mint Account Address
  decimals, // Decimals of Mint
  mintAuthority.publicKey, // Designated Mint Authority
  null, // Optional Freeze Authority
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);




console.log("Before Transaction");
// Add instructions to new transaction
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeTransferFeeConfig,
  initializeMintInstruction,
);

console.log("After Transaction");

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeyPair] // Signers
);

console.log("transactionSignature",transactionSignature);
}

createSPLTokenWithTransferFee();
 