import {
         Connection,
         PublicKey
       } from '@solana/web3.js';
       import {
         getAccount
       } from '@solana/spl-token';
       
       // Connect to Solana Devnet
       const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
       
       // The mint public key
       const mintPublicKey1 = new PublicKey("498bK2F1fCNPsHWdTFiXr8dw51p3SAC4tHPzgRpDUo3j");
       
       // The specific token account address
       const tokenAccountAddress = new PublicKey("6Npj7SEtonjzpWuVi6GMUtfrAG9HsgTmCMgkUYMjBh3e");
       
       async function checkSpecificTokenAccountBalance() {
         try {
           // Get the account info
           const accountInfo = await getAccount(connection, tokenAccountAddress);
           const balance = Number(accountInfo.amount);
       
           console.log(`Token balance: ${balance} (in smallest units)`);
           console.log(`Token balance: ${balance / 10 ** 6} (assuming 6 decimals)`);
       
         } catch (err) {
           console.error('Error checking token account balance:', err);
         }
       }
       
       checkSpecificTokenAccountBalance();
       