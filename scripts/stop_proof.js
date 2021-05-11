const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("./utils");
const violas    = require("../violas.config.js");
const bak_path  = violas.caches_contracts;
const {main, datas, state}  = require(violas.vlscontract_conf);
const {ethers, upgrades}    = require("hardhat");

async function date_format(dash = "-", colon = ":", space = " ") {
    return utils.date_format(dash, colon, space);
}

async function get_contract(name, address) {
    return await utils.get_contract(name, address);
}

async function show_msg(msg, title = "") {
    utils.show_msg(msg, title);
}

async function write_json(filename, data) {
    utils.write_json(filename, data);
}

async function __get_account(address) {
    const accounts = await ethers.getSigners();
    for(let i = 0; i < accounts.length; i++) {
        if (accounts[i].address == address) {
            return accounts[i];
        }
    }
    throw Error("not found account " + address);
}

async function stop_proof() {
    let mcobj           = await get_contract(main.name, main.address);
    let proofAddress    = await mcobj.proofAddress();
    let dcobj           = await get_contract(datas.name, proofAddress);
    let stateAddress    = await dcobj.stateAddress();
    let scobj           = await get_contract(state.name, stateAddress);
    let manager    = await __get_account(await dcobj.manager(0));
    let nextVersion     = await dcobj.nextVersion();
    let min_start_ver   = 0;
    for (let ver = min_start_ver; ver < nextVersion; ver++) {
        let proof = await dcobj.proofInfo(ver);
        min_start_ver = ver;
        if (await scobj.getStateName(proof.state) == "start") {
            utils.warning("update proof version(" + ver + ")state to stop");
            let state = await dcobj.connect(manager).upUSState(ver, "stop");

            proof = await dcobj.proofInfo(ver);
            if (await scobj.getStateName(proof.state) != "start") min_start_ver = ver + 1;
        }
    }
    if (min_start_ver >= nextVersion) min_start_ver = nextVersion -1;
}

async function run() {
    utils.debug("start working...", "stop proof");
    await stop_proof();
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
