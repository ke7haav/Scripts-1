import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

async function getTokenDecimals(mintAddress) {
    // Replace with your RPC URL
//     const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const connection = new Connection('https://floral-old-wind.solana-mainnet.quiknode.pro/<api-key>', 'confirmed');


    // Convert the mint address to a PublicKey
    const mintPublicKey = new PublicKey(mintAddress);

    // Fetch mint account details
    const mintInfo = await getMint(connection, mintPublicKey);

    // Return the decimal value
    return mintInfo.decimals;
}

(async () => {
    const mintAddress = "3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o"; // Replace with the actual mint address
    try {
        const decimals = await getTokenDecimals(mintAddress);
        console.log(`Decimals: ${decimals}`);
    } catch (error) {
        console.error("Error fetching token decimals:", error);
    }
})();
