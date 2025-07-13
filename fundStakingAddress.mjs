import { PublicKey,Connection} from "@solana/web3.js";
import { AnchorProvider, Program,Wallet } from "@project-serum/anchor";
import {IDL} from './idj.mjs'

const programId = new PublicKey("6jMi2CRpAA6uah3qzPpCR8SL8MsuAsB9MtCTKkufXkw2");
const userAddress = new PublicKey("J89F7eZNFUqk66cN6EF2hFSUFz1ii4TZp5tyHHpqepag");
const seed = "<your-seed>"; // Custom seed for PDA

const connection = new Connection("https://floral-old-wind.solana-mainnet.quiknode.pro/<api-key>"); 
const provider = new AnchorProvider(connection, new Wallet("cdsf"), {
         preflightCommitment: 'confirmed',
     });

// Derive the PDA
async function StakingAccountPDA() {
  try {
    const program = new Program(IDL, programId, provider);
    const [stakingAccountPDA, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(seed), // Seed as buffer
        userAddress.toBuffer(), // User's public key as buffer
      ],
      programId // Program ID
    );
    console.log("Staking Account PDA:", stakingAccountPDA.toBase58());
    console.log("Bump Seed:", bump);
    const fetch = await program.account.stakingState.fetch(stakingAccountPDA)
    console.log("Stake Details",fetch)
    return stakingAccountPDA;
  } catch (error) {
    console.error("Error deriving PDA:", error);
  }
};






StakingAccountPDA();


// 5 decimal