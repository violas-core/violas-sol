// scripts/deploy_upgradeable_xxx.js
const fs    = require('fs');
const path  = require("path");
const { ethers, upgrades } = require("hardhat");

async function get_contract(name, address) {
    const cf = await ethers.getContractFactory(name);
    const c = await cf.attach(address);
    return c;
}

function get_files(pathname) {
    let files = fs.readdirSync(pathname)
    let file_names = new Array();
    for (let i = 0; i < files.length; i++) {
        stat = fs.statSync(path.join(pathname, files[i]));
        if (stat.isFile()) {
            file_names.push(files[i]);
        }
    }
    return file_names;
}

function write_datas(filename, data) {
    if (fs.existsSync(filename)) {
        fs.writeFileSync(filename, data);
    } else {
        fs.writeFileSync(filename, data);
    }
    return true;
}

function file_exists(filename) {
    return fs.existsSync(filename);
}

function write_json(filename, data) {
    save_data = JSON.stringify(data, null, "\t");
    return write_datas(filename, save_data);
}
function mkdirs_sync(dirname) {
    if (fs.existsSync(dirname)) {
          return true;
    } else {
          if (mkdirs_sync(path.dirname(dirname))) {
                 fs.mkdirSync(dirname);
                 return true;
          }
    }
}

module.exports = {
    get_contract,
    file_exists,
    write_json,
    write_datas,
    mkdirs_sync,
    get_files,

}
