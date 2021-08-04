const logger    = require("../logger");
const deploy    = require("./deploy721.js");
const { ethers, upgrades } = require("hardhat");

async function main() {
    tokens = deploy.new_token_list();
    const accounts = await ethers.provider.listAccounts();
    owner = accounts[0];

    for (let i = 0; i < tokens.length; i++) {
        let address = tokens[i]["address"];
        logger.table(tokens[i], "deploy:" + tokens[i].symbol)
        if (tokens[i].create == undefined || tokens[i].create) {
            let dp          = await deploy.deploy(tokens[i].name, tokens[i].symbol);
            address         = dp.address;
        }
    
        if (tokens[i].mint == undefined || tokens[i].mint > 0) {
            let dp          = await deploy.get_contract(address);
            
            logger.info(await dp.symbol());
        }
    }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
