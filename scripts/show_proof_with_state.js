const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("./utils");
const logger     = require("./logger");
const violas    = require("../violas.config.js");
const bak_path  = violas.caches_contracts;
const {main, datas, state}  = require(violas.vlscontract_conf);
const {ethers, upgrades}    = require("hardhat");

async function date_format(dash = "-", colon = ":", space = " ") {
    return logger.date_format(dash, colon, space);
}

async function get_contract(name, address) {
    return await utils.get_contract(name, address);
}

async function show_msg(msg, title = "") {
    logger.show_msg(msg, title, {"format": false, "type": "table"});
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

async function filter_proof(proof_state = "start") {
    let mcobj           = await get_contract(main.name, main.address);
    let proofAddress    = await mcobj.proofAddress();
    let dcobj           = await get_contract(datas.name, proofAddress);
    let stateAddress    = await dcobj.stateAddress();
    let scobj           = await get_contract(state.name, stateAddress);
    let nextVersion     = await dcobj.nextVersion();
    let min_start_ver   = 0;
    let sdatas = {};
    for (let ver = min_start_ver; ver < nextVersion; ver++) {
        logger.debug("check version " + ver + "/" + (nextVersion - 1));
        let proof = await dcobj.proofInfo(ver);
        if (await scobj.getStateName(proof.state) == proof_state) {
            sdatas[ver] = proof;
        }
    }
    show_msg(sdatas, "proof info state = " + proof_state + " count " + sdatas.length);
}

async function run() {
    logger.debug("start working...", "filter proof");
    await filter_proof();
}

async function run() {
    logger.debug("start working...", "filter proof");
    await filter_proof("stop");
}
run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
