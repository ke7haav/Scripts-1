const { Connection, PublicKey } = require('@solana/web3.js');
const { getAccount, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function checkTokenBalance(userPublicKey, mintAddress, rpcUrl) {
    // Establish a connection to the Solana cluster
    const connection = new Connection(rpcUrl, 'confirmed');

    try {
        const userPubKey = new PublicKey(userPublicKey);
        const mintPubKey = new PublicKey(mintAddress);

        // Fetch all token accounts owned by the user
        const tokenAccounts = await connection.getTokenAccountsByOwner(userPubKey, {
            programId: TOKEN_PROGRAM_ID,
        });

        // Iterate through token accounts to find the one with the specified mint address
        for (const tokenAccount of tokenAccounts.value) {
            const accountInfo = await getAccount(connection, tokenAccount.pubkey);

            if (accountInfo.mint.toBase58() === mintPubKey.toBase58()) {
                const rawBalance = accountInfo.amount; // This is a BigInt
                const decimals = accountInfo.decimals; // Number of decimals for the token
                const formattedBalance = Number(rawBalance) / Math.pow(10, decimals); // Convert to human-readable format
                
                console.log(`Token Balance: ${rawBalance.toString()} (raw)`);
                console.log(`Token Balance (formatted): ${formattedBalance}`);
                return;
            }
        }

        console.log('No token account found for the specified mint address.');
    } catch (error) {
        console.error('Error checking token balance:', error);
    }
}
// Replace these with your actual values
const userPublicKey = 'CXF61iSwXdrzA829HBNpCmrLb4qPwpGfKGV6yE7yBYgD'; // Replace with the user's wallet address
const mintAddress = '498bK2F1fCNPsHWdTFiXr8dw51p3SAC4tHPzgRpDUo3j'; // Replace with the token's mint address
const rpcUrl = 'https://api.devnet.solana.com'; // Replace with your RPC URL (e.g., mainnet-beta or devnet)

checkTokenBalance(userPublicKey, mintAddress, rpcUrl);
