// scripts/deploy_upgradeable_xxx.js
const violas    = require("../violas.config.js");
const logger    = require("./logger");

const {ethers, upgrades} = require("hardhat");
const {main, datas, state} = require(violas.vlscontract_conf);

async function run() {
    let vls_conf = {
        config:     violas.vlscontract_conf,
        network:    violas.configs.defaultNetwork
    }

    let contracts_conf = {
        main:   main,
        datas:  datas,
        state:  state
    }

    logger.show_msg(vls_conf,    "violas");

    if(violas.tokens_conf != undefined) {
        const {tokens}  = require(violas.tokens_conf);
        logger.show_msg(tokens,      "main can use tokens");
    } else {
        logger.show_msg("tokens config not found.", "main can use tokens");
    }
    logger.show_msg(contracts_conf, "contracts");

    if(violas.erc20_tokens_conf != undefined) {
        const {tokens}  = require(violas.erc20_tokens_conf);
        logger.show_msg(tokens,      "deploys erc20 tokens");
    } else {
        logger.show_msg("tokens config not found.", "tokens");
    }
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
