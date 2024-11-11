import * as web3 from '@solana/web3.js';
import crypto from 'crypto'; // Node.js built-in module for SHA-256 hashing

// Mock passkey generation (replace with actual WebAuthn passkey in production)
async function getPasskey() {
    return {
        id: '',
        rawId: 'mock-raw-id',
    };
}

// Derive Solana Private Key from Passkey
async function deriveSolanaPrivateKey(passkey) {
    const passkeyData = passkey.id + passkey.rawId; // Unique identifier from passkey
    const hash = crypto.createHash('sha256').update(passkeyData).digest('hex');
    const privateKeyBuffer = Buffer.from(hash, 'hex').slice(0, 32); // 32-byte private key

    // Generate the keypair from the private key (32 bytes) for Solana
    const tempKeypair = web3.Keypair.fromSeed(privateKeyBuffer); // Use only the private key
    const fullSecretKey = Buffer.concat([tempKeypair.secretKey.slice(0, 32), tempKeypair.publicKey.toBuffer()]); // 64-byte key

    return fullSecretKey;
}

// Initialize Solana Wallet using the derived private key
async function initializeSolanaWallet() {
    const passkey = await getPasskey();
    console.log("passKey",passkey);
    if (!passkey) return;

    // const passkey = "Random_String";
    const fullSecretKey = await deriveSolanaPrivateKey(passkey);
    const keypair = web3.Keypair.fromSecretKey(fullSecretKey);

    // Connect to Solana's devnet
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    const wallet = { keypair, connection };

    console.log('Solana Wallet Address:', keypair.publicKey.toString());
    return wallet;
}

// Example Usage: Get Wallet Balance
async function getWalletBalance(wallet) {
    const balance = await wallet.connection.getBalance(wallet.keypair.publicKey);
    console.log('Wallet Balance:', balance / web3.LAMPORTS_PER_SOL, 'SOL');
}

// Example Workflow
(async () => {
    const wallet = await initializeSolanaWallet();
    if (wallet) {
        await getWalletBalance(wallet);
    }
})();
