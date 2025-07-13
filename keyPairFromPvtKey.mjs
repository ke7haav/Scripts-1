import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Your private key
const privateKeyLambo="<Your-Solana-Private-Key>"

// Decode the private key from Base58
const secretKey = bs58.decode(privateKeyLambo);

// Generate the Keypair
const keypair = Keypair.fromSecretKey(secretKey);

// Display the public key and secret key
console.log("Public Key:", keypair.publicKey.toBase58());
console.log("Secret Key (Base58):", bs58.encode(keypair.secretKey));

// Display the Uint8Array representation of the secret key
console.log("Secret Key (Uint8Array):", Array.from(keypair.secretKey));
