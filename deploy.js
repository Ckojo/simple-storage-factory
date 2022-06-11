const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const rpcServer = process.env.RPC_URL;
  const provider = new ethers.providers.JsonRpcProvider(rpcServer);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait....");
  const contract = await contractFactory.deploy(); // STOP here, wait for contract to deploy
  await contract.deployTransaction.wait(1); // THIS IS A KIND OF TRANSACTION RECEIPT

  // ============================== THIS IS HOW WE CAN DEPLOY WITH OUR OWN TRANSACTION DATA ==============================
  // console.log("Deploying with only transaction data");
  // const nonce = await wallet.getTransactionCount();
  // const tx = {
  //   nonce: nonce,
  //   gasPrice: 20000000000,
  //   gasLimit: 6721975,
  //   to: null,
  //   value: 0,
  //   data: "0x608",
  //   chainId: 1337,
  // };
  // const sentTxResponse = await wallet.sendTransaction(tx);
  // await sentTxResponse.wait(1);
  // console.log(sentTxResponse);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);

  const transactionResponse = await contract.store("7");
  await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
