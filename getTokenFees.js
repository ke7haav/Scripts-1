import { ethers, utils } from "ethers";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { string, string } from "ethers";

let provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
let signer = new ethers.Wallet("private key", provider);

async function getFeeQuotesOrData (userOp) {
    
         const url="paymaster url"
         
         const requestData = {
             jsonrpc: '2.0',
             method: 'pm_getFeeQuoteOrData',
             id: Date.now(),
             params: [
               userOp,
               {
                 mode: 'ERC20',
                 tokenInfo: {
                     tokenList: ["", ""],
                     preferredToken: "",
                 },
                 expiryDuration: 300,
                 calculateGasLimits: true,
               },
             ],
         };
         try {
           const response = await axios.post(url, requestData);
           console.log('Response:', response.data);
           const feeQuotesResponse = response.data.result.feeQuotes
           const selectedFeeQuote = feeQuotesResponse[5];  // select the preferred token
           const maxGasFee = selectedFeeQuote.maxGasFee;
           const selectedToken = selectedFeeQuote.tokenAddress;
           return userOp;
         } catch (error) {
           console.error(error);
             return error;
         } 
     }




  // Step 1 Gas estimation
  let userOp = await getGasFeeValues(partialUserOp)

  // Step 2 Get ERC20 fee quotes
  await getFeeQuotesOrData(userOp)


