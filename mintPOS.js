const {ethers} = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/<INFURA-AP-KEY>");

const privateKey = "<Private-Key>";
const signer = new ethers.Wallet(privateKey, provider);

const TokenAddress = "0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31";

const tokenABI = [
         // The ABI of the mint function
         "function mint(address to, uint256 amount) public"
       ];

const tokencontract = new ethers.Contract(TokenAddress,tokenABI,signer);

async function mintToken(){
         try{
          const tx = await tokencontract.mint("0xFF052567B3E9f19CfD6a72aadd68B058d46cAC1b", 100000000000000000000n);
          console.log(tx.hash);
         }catch(error){
             console.log(error);
         }
}

mintToken();
