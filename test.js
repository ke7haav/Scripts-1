const ethers = require('ethers');

// Generate a random mnemonic (12 words)
// const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
// console.log("Random Mnemonic Phrase:", mnemonic);

// You can specify the entropy strength if needed (default is 128 bits)
// const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;

const walletMnemonic = ethers.Wallet.fromMnemonic("culture client whip learn kit cruel insane fluid school farm staff legal");

console.log(walletMnemonic);
console.log(walletMnemonic.address);
console.log(walletMnemonic.mnemonic.path);
console.log("Private Key",walletMnemonic.privateKey);

console.log("Public Key",walletMnemonic.publicKey);

const seed = ethers.utils.mnemonicToSeed("");
console.log("sEED --",seed);

const result = ethers.utils.isValidMnemonic("")
console.log(result);

const rootNode = ethers.utils.HDNode.fromSeed(seed);
console.log(rootNode); 

const masterPrivateKey = rootNode.privateKey;
console.log("Master Private Key:", masterPrivateKey);

const childNode1 = rootNode.derivePath("m/44'/60'/0'/0/0");
const childNode2 = rootNode.derivePath("m/44'/60'/0'/0/1");
const childNode3 = rootNode.derivePath("m/44'/60'/0'/0/2");


console.log("Child 1 - Private Key:", childNode1.privateKey);
console.log("Child 1 - Public Key:", childNode1.publicKey);
console.log("Child 1 - Address:", ethers.utils.computeAddress(childNode1.publicKey));

console.log("Child 2 - Private Key:", childNode2.privateKey);
console.log("Child 2 - Public Key:", childNode2.publicKey);
console.log("Child 2 - Address:", ethers.utils.computeAddress(childNode2.publicKey));

console.log("Child 3 - Private Key:", childNode3.privateKey);
console.log("Child 3 - Public Key:", childNode3.publicKey);
console.log("Child 3 - Address:", ethers.utils.computeAddress(childNode3.publicKey));
