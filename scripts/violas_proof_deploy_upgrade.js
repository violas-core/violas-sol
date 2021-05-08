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

async function deploy(name) {
    const cf = await ethers.getContractFactory(name);
    utils.debug("Deploying " + name + " ...");
    const dp = await upgrades.deployProxy(cf);
    await dp.deployed();
    utils.info(name + " deployed to: " + dp.address);
    return dp
}

async function upgrade(name, address) {
    const cf = await ethers.getContractFactory(name);
    utils.debug("Upgrading " + name + " address: " + address + " ...");
    const up = await upgrades.upgradeProxy(address, cf);
    utils.info(name + " upgraded");
    return up;
}

async function check_and_deploy(item) {
    let name = item.name;
    let create = item.deploy;
    let params = item.params;
    let address = item.address;
    let dp;

    utils.info("switch: " + item.deploy, "check_and_deploy(" + name + ")")

    if (create) {
        dp = await deploy(name, params);
    } else {
        if (address.length > 0) {
            dp = await get_contract(name, address);
        } else {
            dp = {"address" : address};
        }
    }
    return dp;
}

async function check_and_upgrade(item) {
    let name = item.name;
    let address = item.address;
    let create = item.upgrade;
    let dp;

    utils.info("switch: " + item.upgrade, "check_and_upgrade(" + name + ")")

    if (create) {
        dp = await upgrade(name, address);
    } else {
        if (address.length > 0) {
            dp = await get_contract(name, address);
        } else {
            dp = {"address" : address};
        }
    }
    return dp;
}

async function update_conf(filename) {
    data = {state : state, datas : datas, main : main};
    await write_json(filename, data);
}

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
          return true;
    } else {
          if (mkdirsSync(path.dirname(dirname))) {
                 fs.mkdirSync(dirname);
                 return true;
          }
    }
}

async function bak_conf(pathname) {
    let mark = await date_format("", "", "");
    let filename = path.basename(pathname)
    let new_pathname = bak_path + mark + "_" + filename;

    utils.info("save old config to: " + new_pathname , "bak_conf(" + filename + ")");
    data = {state : state, datas : datas, main : main};
    if (!fs.existsSync(bak_path)) {
        mkdirsSync(bak_path);
    }
    await write_json(new_pathname, data);
}

async function close_deploy(item, address) {
    if (item.deploy) {
        item.address = address;
        item.deploy = false;
        await update_conf(violas.vlscontract_conf);
    }
}
async function close_upgrade(item) {
    if (item.upgrade) {
        item.upgrade= false;
        await update_conf(violas.vlscontract_conf);
    }
}

async function check_deploy_upgrade_value(item) {
    if (item.deploy == item.upgrade && item.deploy) {
        throw new Error(item.name + " deploy and upgrade is true, only one is true?")
    }
}

async function check_upgrade_value(item) {
    if (item.upgrade && item.address.length <= 0) {
        throw new Error(item.name + " upgrade is true, but address is empty. set address or set upgrade = false")
    }
}

async function check_conf() {
    let items = [state, datas, main];
    let has_work = false;
    for (let i = 0; i < items.length; i++) {
        await check_deploy_upgrade_value(items[i]);
        await check_upgrade_value(items[i]);
        has_work = has_work || items[i].deploy || items[i].upgrade;
    }

    if (!has_work) {
        //throw Error("config is ok, but all switch is false.")
    }
}
async function run() {
    utils.debug("start working...", "deploy or upgrade");
    await check_conf();
    await bak_conf(violas.vlscontract_conf);
    //logic for state datas and main: deploy or upgrade
    //d_xxx must have address
    const d_state = await check_and_deploy(state);
    await close_deploy(state, d_state.address);
    const d_datas = await check_and_deploy(datas);
    await close_deploy(datas, d_datas.address);
    const d_main  = await check_and_deploy(main);
    await close_deploy(main, d_main.address);

    
    //u_xxx must have contract 
    const u_state = await check_and_upgrade(state);
    await close_upgrade(state);
    const u_datas = await check_and_upgrade(datas);
    await close_upgrade(datas);
    const u_main  = await check_and_upgrade(main);
    await close_upgrade(main);
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
