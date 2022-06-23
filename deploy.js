const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying contract, Please wait...");
  const deployContract = await contractFactory.deploy();
  console.log(`Contract Address at ${deployContract.address}`);
  // const deploymentReceipt = await deployContract.deployTransaction.wait(1);
  // console.log(deploymentReceipt);
  const currentFavoriteNumber = await deployContract.retrieve();
  console.log(`The favorite number is ${currentFavoriteNumber.toString()}`);

  const transactionResponse = await deployContract.store("7");
  //This line is not mandatory, this is only for the confirmation that the transaction has been attached to atleast one block
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await deployContract.retrieve();
  console.log(`The modified favorite number is ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
