// scripts/deploy_upgradeable_xxx.js
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

async function new_proof(tokenName = "usdt") {
    let mcobj           = await get_contract(main.name, main.address);
    let proofAddress    = await mcobj.proofAddress();
    let tokenAddress    = await mcobj.tokenAddress(tokenName);
    let tcobj           = await get_contract("STDERC20", tokenAddress);
    utils.debug(tokenName + " address: " + tokenAddress + " symbol: " + await tcobj.symbol());
}

async function run() {
    utils.debug("start working...", "deploy or upgrade");
    await new_proof();
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
