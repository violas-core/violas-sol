// scripts/deploy_upgradeable_xxx.js
const { ethers, upgrades } = require("hardhat");
const vlscontract_conf = "vlscontract.json";
const bak_path = "./baks/confs/";
const {main, datas, state} = require("../" + vlscontract_conf);
const fs = require('fs');
const path = require("path");

async function deploy(name) {
    const cf = await ethers.getContractFactory(name);
    console.log("Deploying " + name + " ...");
    const dp = await upgrades.deployProxy(cf);
    await dp.deployed();
    await show_msg(name + " deployed to: " + dp.address);
    return dp
}

async function upgrade(name, address) {
    const cf = await ethers.getContractFactory(name);
    console.log("Upgrading " + name + " address: " + address + " ...");
    const up = await upgrades.upgradeProxy(address, cf);
    console.log(name + " upgraded");
    return up;
}

async function date_format(dash = "-", colon = ":", space = " ") {
    function pad(n) {return n < 10 ? "0" + n : n}
    function _date(p, split, val ) { return p.length > 0 ? p + split + pad(val): "" + pad(val)}
    d = new Date();
    var ret = _date("", dash, d.getFullYear());
    ret = _date(ret, dash, d.getMonth() + 1);
    ret = _date(ret, dash, d.getDate());
    ret = _date(ret, space, d.getHours());
    ret = _date(ret, colon, d.getMinutes());
    ret = _date(ret, colon, d.getSeconds());
    return ret;
}

async function get_contract(name, address) {
    const cf = await ethers.getContractFactory(name);
    const c = await cf.attach(address);
    return c;
}

async function check_and_deploy(item) {
    var name = item.name;
    var create = item.deploy;
    var params = item.params;
    var address = item.address;
    var dp;

    await show_msg(item, "check_and_deploy(" + name + ")")

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
    var name = item.name;
    var address = item.address;
    var create = item.upgrade;
    var dp;

    await show_msg(item, "check_and_upgrade(" + name + ")")

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

async function show_msg(msg, title = "") {
    if (title.length > 0) {
        var split_symbol = "-------------------------------------";
        console.log(split_symbol + title + split_symbol)
    }
    msg = JSON.stringify(msg);
    if (typeof(msg) == "string") {
        msg = await date_format() + ": " + msg;
    }
    console.log(msg);
}

async function write_json(filename, data) {
    save_data = JSON.stringify(data, null, "\t");
    if (fs.existsSync(filename)) {
        fs.writeFileSync(filename, save_data);
    } else {
        fs.writeFileSync(filename, save_data);
    }
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

async function bak_conf(filename) {
    data = {state : state, datas : datas, main : main};
    var mark = await date_format("", "", "");
    if (!fs.existsSync(bak_path)) {
        mkdirsSync(bak_path);
    }
    await write_json(bak_path + mark + "_" + filename, data);
}
async function close_deploy(item, address) {
    if (item.deploy) {
        item["address_old"] = item.address;
        item.address = address;
        item.deploy = false;
        await update_conf(vlscontract_conf);
    }
}
async function close_upgrade(item) {
    if (item.upgrade) {
        item.upgrade= false;
        await update_conf(vlscontract_conf);
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
    var items = [state, datas, main];
    for (var i = 0; i < items.length; i++) {
        await check_deploy_upgrade_value(items[i]);
        await check_upgrade_value(items[i]);
    }
}
async function run() {
    await check_conf();
    await bak_conf(vlscontract_conf);
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

    /* use d_xxx
    const c_state = await get_contract(state.name, d_state.address);
    const c_datas = await get_contract(datas.name, d_datas.address);
    const c_main  = await get_contract(main.name, d_main.address);
    */

}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
