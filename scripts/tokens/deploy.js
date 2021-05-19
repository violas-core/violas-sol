// scripts/deploy_upgradeable_xxx.js
const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("../utils");
const violas    = require("../../violas.config.js");
const bak_path  = violas.caches_erc20_tokens;
const {tokens}  = require(violas.erc20_tokens_conf);
const {ethers, upgrades}    = require("hardhat");
const contract_name         = "TESTERC20";

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

async function update_conf(filename, token) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol == token.symbol) {
            tokens[i]["address"]    = token.address;
            tokens[i]["create"]     = false;
        }
    }

    data = {"tokens": tokens};
    await write_json(filename, data);
}

function mkdirs_sync(dirname) {
    return  utils.mkdirs_sync(dirname)
}

async function create_token_info(name, symbol, address, decimals) {
    return {
        "name":     name,
        "symbol":   symbol,
        "address":  address,
        "decimals": decimals,
    }
}

async function bak_conf() {
    let pathname = violas.erc20_tokens_conf;
    let mark = await date_format("", "", "");
    let filename = path.basename(pathname)
    let new_pathname = bak_path + mark + "_" + filename;

    const {old_tokens}  = require(violas.erc20_tokens_conf);
    utils.info("save old config to: " + new_pathname , "bak_conf(" + filename + ")");
    if (!fs.existsSync(bak_path)) {
        mkdirs_sync(bak_path);
    }
    await write_json(new_pathname, old_tokens);
}

async function get_contract(address) {
    return await utils.get_contract(contract_name, address);
}

async function deploy(name, symbol, decimals = 18) {
    await bak_conf();
    const cf = await ethers.getContractFactory(contract_name);
    utils.debug("Deploying " + name + " ...");
    const dp = await cf.deploy(name, symbol, decimals);
    await dp.deployed();
    utils.info(name + " deployed to: " + dp.address);

    token = await create_token_info(name, symbol, dp.address, decimals);
    await update_conf(violas.erc20_tokens_conf, token);

    return dp
}

async function upgrade(address) {
    const cf = await ethers.getContractFactory(contract_name);
    utils.debug("Upgrading " + name + " address: " + address + " ...");
    const up = await upgrades.upgradeProxy(address, cf);
    utils.info(name + " upgraded");
    return up;
}

function new_token_list() {
    let ret = [];
    for (let i = 0; i < tokens.length; i++) {
          ret.push(tokens[i]);
    }
    return ret;
}

module.exports = {
    deploy,
    new_token_list,
    get_contract
}
