// scripts/deploy_upgradeable_xxx.js
const { ethers, upgrades } = require("hardhat");
const {main, datas, state} = require("../vlscontract.json");

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
