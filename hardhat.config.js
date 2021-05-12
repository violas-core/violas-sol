require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
const { key, mnemonic, key_infura } = require('./secrets.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "internal",
  networks: {
      localhost: {
          },
      internal: {
          //url: `https://kovan.infura.io/v3/${key_infura}`,
          url: `https://eth-kovan.alchemyapi.io/v2/${key}`,
          accounts :{mnemonic : mnemonic}
      }
      external: {
          //url: `https://kovan.infura.io/v3/${key_infura}`,
          url: `https://eth-kovan.alchemyapi.io/v2/${key}`,
          accounts :{mnemonic : mnemonic}
      }
  },
};

