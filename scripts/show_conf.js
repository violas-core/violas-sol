// scripts/deploy_upgradeable_xxx.js
const { ethers, upgrades } = require("hardhat");
const violas = require("../violas.config.js");
const {main, datas, state} = require(violas.vlscontract_conf);
const {tokens}= require(violas.tokens_conf);

async function show(item, type) {
    if (type == "log") {
        for(k in item) {
            console.log(k + "\t: " + item[k])
        }
    } else {
        console.table(item)
    }
}

async function run(type) {
    var violas_conf = {
        config : violas.vlscontract_conf,
        network : violas.configs.defaultNetwork
    }
    console.log("************violas conf************")
    await show(violas_conf, type);
    console.log("************tokens conf(" + tokens.length + ")************")
    for(var i = 0; i < tokens.length; i++) {
        await show(tokens[i], type);
    }
    console.log("************main************")
    await show(main, type)
    console.log("************datas************")
    await show(datas, type)
    console.log("************state************")
    await show(state, type)
}

run("table")
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
