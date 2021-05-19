// scripts/deploy_upgradeable_xxx.js
const violas    = require("../violas.config.js");
const utils     = require("./utils");

const {ethers, upgrades} = require("hardhat");
const {main, datas, state} = require(violas.vlscontract_conf);

async function show_msg(msg, title = "") {
    utils.show_msg(msg, title, {"format": false, "type": "table"});
}

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

    await show_msg(vls_conf,    "violas");

    if(violas.tokens_conf != undefined) {
        const {tokens}  = require(violas.tokens_conf);
        await show_msg(tokens,      "main can use tokens");
    } else {
        await show_msg("tokens config not found.", "main can use tokens");
    }
    await show_msg(contracts_conf, "contracts");

    if(violas.erc20_tokens_conf != undefined) {
        const {tokens}  = require(violas.erc20_tokens_conf);
        await show_msg(tokens,      "deploys erc20 tokens");
    } else {
        await show_msg("tokens config not found.", "tokens");
    }
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
