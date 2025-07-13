import {
         Connection,
         Keypair,
         PublicKey,
         clusterApiUrl,
       } from "@solana/web3.js";
       import {
         TOKEN_2022_PROGRAM_ID,
         setAuthority,
         AuthorityType,
         getAssociatedTokenAddress
       } from "@solana/spl-token";
       
       // Mint information
       const mintPubKey = new PublicKey("bEbtYjkUXghY4ukTiExNJrvbwMpzkXRondgiqGkSs6P");
       
       // Keypairs
       const payer = Keypair.fromSecretKey(
         Uint8Array.from([
           
         ])
       );
       const mintAuthority = Keypair.fromSecretKey(
         Uint8Array.from([
    
         ])
       );
       
       // Connection to Devnet
       const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
       
       async function pauseMintAuthority() {
         try {
           console.log("Revoking mint authority...");
           console.log("TOKEN_2022_PROGRAM_ID",TOKEN_2022_PROGRAM_ID);
           // Call `setAuthority` with the correct token program ID
         //   const transactionSignature = await setAuthority(
         //     connection,
         //     payer, // Fee payer
         //     mintPubKey, // Mint account
         //     mintAuthority.publicKey, // Current mint authority
         //     AuthorityType.MintTokens, // Authority type
         //     null, // New authority (null to revoke)
         //     [mintAuthority], // Current mint authority signer
         //     TOKEN_2022_PROGRAM_ID // Explicitly use Token-2022 Program
         //   );

         const senderTokenAccount = await getAssociatedTokenAddress(
                  mintPubKey,        // Token mint address
                  payer.publicKey,      // User's wallet address
                  false,              // Set to false for non-multisig wallets
                  TOKEN_2022_PROGRAM_ID    // Specify the new token program ID
                  );
                

         console.log(senderTokenAccount);
           const transactionSignature = await setAuthority(
                  connection, // Connection to use
                  payer, // Payer of the transaction fee
                  senderTokenAccount, // Associated Token Account
                  payer.publicKey, // Owner of the Associated Token Account
                  AuthorityType.AccountOwner, // Type of Authority
                  null, // New Account Owner
                  undefined, // Additional signers
                  undefined, // Confirmation options
                  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
                );
       
           console.log("Transaction Signature:", transactionSignature);
           console.log("Mint Address:", mintPubKey.toBase58());
           console.log("Mint authority successfully revoked.");
         } catch (err) {
           console.error("Error revoking mint authority:", err);
         }
       }
       
       pauseMintAuthority();
       