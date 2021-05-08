// scripts/deploy_upgradeable_xxx.js
const violas    = require("../violas.config.js");
const utils     = require("./utils");
const {tokens}  = require(violas.tokens_conf);
const {ethers, upgrades} = require("hardhat");
const {main, datas, state} = require(violas.vlscontract_conf);

async function show_msg(msg, title = "") {
    utils.show_msg(msg, title, {"format": false, "type": "table"});
}

async function run() {
    var vls_conf = {
        config:     violas.vlscontract_conf,
        network:    violas.configs.defaultNetwork
    }

    var contracts_conf = {
        main:   main,
        datas:  datas,
        state:  state
    }

    await show_msg(vls_conf,    "violas");
    await show_msg(tokens,      "tokens");
    await show_msg(contracts_conf, "contracts");
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
