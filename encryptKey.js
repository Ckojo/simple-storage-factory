const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );
  try {
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
    console.log("Encryption has been finished");
  } catch (error) {
    console.error(error);
  }
}

main()
  .then((result) => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
