// scripts/deploy_upgradeable_xxx.js
const fs = require('fs');
const path = require("path");
const { ethers, upgrades } = require("hardhat");

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
    return true;
}

module.exports = {
    date_format,
    get_contract,
    show_msg,
    write_json
}
