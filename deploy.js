const ethers = require("ethers");
const fs = require("fs");

async function main() {
  const rpcServer = "http://127.0.0.1:7545";
  const provider = new ethers.providers.JsonRpcProvider(rpcServer);
  const wallet = new ethers.Wallet(
    "6c2fedc83aaba541b21a63b98ad0dd39c6e0477a46e21c597df4e29f9752b1fe",
    provider
  );
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait....");
  const contract = await contractFactory.deploy(); // STOP here, wait for contract to deploy
  const transactionReceipt = await contract.deployTransaction.wait(1);

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
  console.log(currentFavoriteNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
