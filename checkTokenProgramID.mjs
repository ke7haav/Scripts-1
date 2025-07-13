import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const tokenMint = new PublicKey("YourTokenMintHere");

const info = await connection.getAccountInfo(tokenMint);
console.log("Owner Program ID:", info?.owner.toBase58());

if (info?.owner.toBase58() === "TokenzQdB2jhVzdU2oJjWmMRz1f1SSjFzZn4UQCn5Pz") {
  console.log("✅ This token uses Token-2022 Program");
} else if (info?.owner.toBase58() === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
  console.log("✅ This token uses Original SPL Token Program");
} else {
  console.log("❌ Unknown or non-standard token program");
}

