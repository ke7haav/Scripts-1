import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58'; // Base58 encoding library

// The provided secret key
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from([
]));

// Encode the full secret key (private + public keys) in Base58
const fullPrivateKeyBase58 = bs58.encode(senderKeypair.secretKey);

// Log the full private key
console.log('Full Private Key (Base58):', fullPrivateKeyBase58);

