import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createMint, createAccount, getMint, getAccount } from '@solana/spl-token';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58'; 
async function createSPLToken({
    connection,
    payerKeypair,
    mintAuthority,
    freezeAuthority,
    decimals,
    name,
    symbol,
}) {
    try {
        // Create the mint account
        const mint = await createMint(
            connection,
            payerKeypair, // Fee payer
            mintAuthority.publicKey, // Mint authority
            freezeAuthority.publicKey, // Freeze authority
            decimals // Number of decimals
        );

        console.log(`Mint address: ${mint.toBase58()}`);

        // Optionally set metadata like name and symbol
        console.log(`Token Name: ${name}`);
        console.log(`Token Symbol: ${symbol}`);
        console.log(`Decimals: ${decimals}`);

        return mint;
    } catch (error) {
        console.error("Error creating SPL token:", error);
    }
}

async function main() {
    // Connect to Solana Mainnet
//     const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const connection = new Connection('https://floral-old-wind.solana-mainnet.quiknode.pro/<api-key>', 'confirmed');

    // Generate Keypairs
    const payerKeypair = Keypair.fromSecretKey(
         Uint8Array.from([
            
         ])
       ); 
    const mintAuthority = Keypair.fromSecretKey(
         Uint8Array.from([
             
         ])
       ); 
    const freezeAuthority = Keypair.fromSecretKey(
         Uint8Array.from([
                
         ])
       ); 


       const balance = await connection.getBalance(payerKeypair.publicKey);
console.log(`Fee Payer Balance: ${balance / 1e9} SOL`);


    console.log("Fee Payer Public Key:", payerKeypair.publicKey.toBase58());
    console.log("Mint Authority Public Key:", mintAuthority.publicKey.toBase58());
    console.log("Freeze Authority Public Key:", freezeAuthority.publicKey.toBase58());

    // Fund the payer account with SOL to cover fees
    console.log("Fund the payer wallet with some SOL before running this script.");

    // Create the SPL Token
    const mint = await createSPLToken({
        connection,
        payerKeypair,
        mintAuthority,
        freezeAuthority,
        decimals: 6, // Number of decimal places (e.g., 6 for USDC-like tokens)
        name: "BEBE",
        symbol: "BEBE",
    });

    console.log(`SPL Token created successfully with Mint Address: ${mint.toBase58()}`);

// Fee Payer Public Key: Fn89RnaDENw6BKMUQvTfLdpa4aipddGqoKsoJisy75EU
// Mint Authority Public Key: Fn89RnaDENw6BKMUQvTfLdpa4aipddGqoKsoJisy75EU
// Freeze Authority Public Key: Fn89RnaDENw6BKMUQvTfLdpa4aipddGqoKsoJisy75EU
// Fund the payer wallet with some SOL before running this script.
// Mint address: kpQ3HWRcf83tTCfwLnVWSq1baYXNKEgTRrgNxJWF6zR
// Token Name: My Custom Token
// Token Symbol: MYT
// Decimals: 6
// SPL Token created successfully with Mint Address: kpQ3HWRcf83tTCfwLnVWSq1baYXNKEgTRrgNxJWF6zR

//    const mintAddress = "kpQ3HWRcf83tTCfwLnVWSq1baYXNKEgTRrgNxJWF6zR"; 
//    await addMetadata(mintAddress, payerKeypair);
}

async function addMetadata(mintAddress, payerKeypair) {
         // const connection = new Connection("https://api.devnet.solana.com", "confirmed");
         const connection = new Connection('https://floral-old-wind.solana-mainnet.quiknode.pro/<api-key>', 'confirmed');
     
         // Initialize Metaplex instance
         const metaplex = new Metaplex(connection).use(keypairIdentity(payerKeypair));
     
         const mintPublicKey = new PublicKey(mintAddress);
     
         const metadata = {
             name: "My Custom Token",
             symbol: "MYT",
             uri: "https://example.com/metadata.json", // Replace with a valid metadata URI
             sellerFeeBasisPoints: 0, // Royalty for secondary sales (0 for SPL tokens)
             creators: [
                 {
                     address: payerKeypair.publicKey, // Update authority's public key
                     share: 100, // Share of royalties (if applicable)
                     verified: true, // Ensure the creator is verified
                 },
             ],
         };
     
         const { metadataAddress } = await metaplex
             .nfts()
             .create({
                 name: metadata.name,
                 symbol: metadata.symbol,
                 uri: metadata.uri,
                 mint: mintPublicKey,
                 payer: payerKeypair,
                 updateAuthority: payerKeypair, // Ensure the updateAuthority is set
                 creators: metadata.creators, // Provide creators array explicitly
             });
     
         console.log(`Metadata added to token: ${metadataAddress.toBase58()}`);
}


async function getKeyPairFrompvtKey(pvtKey){
         try {
                  // Decode the Base58 private key
                  const privateKey = bs58.decode(pvtKey);
          
                  // Generate the Keypair
                  const keypair = Keypair.fromSecretKey(privateKey);
          
                  // Print the public key and the original secret key
                  console.log("Public Key:", keypair.publicKey.toBase58());
                  console.log("Secret Key (Uint8Array):", Array.from(keypair.secretKey));
              } catch (error) {
                  console.error("Error creating Keypair:", error);
              }
         
}

const pvtKey= ''

getKeyPairFrompvtKey(pvtKey);

// main()
