require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
const { key, mnemonic, key_infura, key_infura_mainnet} = require('./secrets.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }

  console.log(ethers.networks);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
      compilers: [
          {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                }
            }
          },
          {
            version: "0.6.0",
            settings: {}
          }
      ]
  },
  defaultNetwork: "localhost",
  networks: {
      hardhat: {
          mining: {
              auto: true,
              //interval: [1000, 3000]
          }
      },
      localhost: {
      },

      internal_alchemy: {
          url: `https://eth-kovan.alchemyapi.io/v2/${key}`,
          accounts :{mnemonic : mnemonic}
      },

      external: {
          url: `https://kovan.infura.io/v3/${key_infura}`,
          accounts :{mnemonic : mnemonic}
      },
      internal: {
          url: `https://kovan.infura.io/v3/${key_infura}`,
          accounts :{mnemonic : mnemonic}
      },
      mainnet: {
          url: `https://mainnet.infura.io/v3/${key_infura_mainnet}`,
          accounts :{mnemonic : mnemonic}
      }
  },
};

