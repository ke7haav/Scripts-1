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
         createInitializeImmutableOwnerInstruction,
         revoke,
         setAuthority,
         TYPE_SIZE,
         LENGTH_SIZE
       } from "@solana/spl-token";
import {createInitializeInstruction,createUpdateFieldInstruction} from "@solana/spl-token-metadata";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
// const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

// console.log(connection);

// const connection = new Connection('https://floral-old-wind.solana-mainnet.quiknode.pro/<api-key>', 'confirmed');



const payer =Keypair.fromSecretKey(Uint8Array.from([

       ]));
const mintAuthority =  Keypair.fromSecretKey(Uint8Array.from([

]));
const mintKeyPair = Keypair.generate();
      
console.log("mintKeyPair",mintKeyPair);
const mintPubKey = mintKeyPair.publicKey;

console.log("MintPublicKey", mintPubKey);

//Authority that can modify the transfer Fee 
const transferFeeConfigAuthority =  Keypair.fromSecretKey(Uint8Array.from([

]));

//Authority that can move withheld token to either mint or any Token Accounts 
const withdrawWithheldAuthority =  Keypair.fromSecretKey(Uint8Array.from([

]));

const decimals = 6;
// const feeBasisPoints = 1000; 
// const maxFee = BigInt(1000000000000000000000n);


async function createSPLTokenWithTransferFee() {
const metadata={
mint:mintPubKey,
name:"Lambocoin",
symbol:"Lambo",
uri:"https://emerald-dear-pelican-435.mypinata.cloud/ipfs/bafkreibarvhgowwpsrjrjjgzhayaso4wogkdwgkqhetoue3lx2crxubz6q",
additionalMetadata:[]
}



const mintLen = getMintLen([ExtensionType.MetadataPointer]);
// const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);

// const metadataSpace = TYPE_SIZE +LENGTH_SIZE +pack(metadata.length);
const metadataSpace = TYPE_SIZE + LENGTH_SIZE + JSON.stringify(metadata).length;

      
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen+metadataSpace);
console.log("lamports Req",lamports);



// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
  newAccountPubkey: mintPubKey, // Address of the account to create
  space: mintLen, // Amount of bytes to allocate to the created account
  lamports, // Amount of lamports transferred to created account
  programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
});

// const initializeTransferFeeConfig =
//   createInitializeTransferFeeConfigInstruction(
//     mintPubKey, // Mint Account address
//     transferFeeConfigAuthority.publicKey, // Authority to update fees
//     withdrawWithheldAuthority.publicKey, // Authority to withdraw fees
//     feeBasisPoints, // Basis points for transfer fee calculation
//     maxFee, // Maximum fee per transfer
//     TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
//   );

// const initializeImmutableOwnerInstruction =
//   createInitializeImmutableOwnerInstruction(
//     tokenAccount, // Token Account address
//     TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
//   );
// Instruction to initialize the MetadataPointer Extension
const initializeMetaDataPointerInstruction = await createInitializeMetadataPointerInstruction(
  mintPubKey, // Mint Account address
  payer.publicKey, // Authority that can set the metadata address
  mintPubKey, // Account address that holds the metadata
  TOKEN_2022_PROGRAM_ID,
);

// Instruction to initialize Mint Account data
const initializeMintInstruction = await createInitializeMintInstruction(
  mintPubKey, // Mint Account Address, Here we can also add freeze Authority 
  decimals, // Decimals of Mint
  mintAuthority.publicKey, // Designated Mint Authority
  null, // Optional Freeze Authority
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

// Instruction to initialize Metadata Account data
const initializeMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  metadata: mintPubKey, // Account address that holds the metadata
  updateAuthority: mintAuthority.publicKey, // Authority that can update the metadata
  mint: mintPubKey, // Mint Account address
  mintAuthority: mintAuthority.publicKey, // Designated Mint Authority
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
});

// Instruction to update metadata, adding custom field
const updateFieldInstruction = createUpdateFieldInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  metadata: mintPubKey, // Account address that holds the metadata
  updateAuthority: mintAuthority.publicKey// Authority that can update the metadata
});

console.log("Before Transaction");
// Add instructions to new transaction
const transaction = new Transaction().add(
  createAccountInstruction,
  // initializeTransferFeeConfig,
  initializeMetaDataPointerInstruction,
  initializeMintInstruction,
  initializeMetadataInstruction,
  updateFieldInstruction
);

console.log("After Transaction");

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeyPair] // Signers
);

console.log("mintPublicKey",mintKeyPair.publicKey);
console.log("transactionSignature",transactionSignature);

}

createSPLTokenWithTransferFee();
 












// [toolchain]

// [features]
// resolution = true
// skip-lint = false

// [programs.localnet]
// summit_launchpad = "4jSudG1CwQfAJmfK53iPYFEJ1QG8ToyZEfBgsE1AAcgC"

// [registry]
// url = "https://anchor.projectserum.com"

// [provider]
// cluster = "mainnet"
// wallet = "/home/lenovo/.config/solana/id.json"

// [test]
// startup_wait = 20000
// deploy_on_test = false  

// [test.validator]
// url = "https://api.mainnet-beta.solana.com"

// [scripts]
// test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
