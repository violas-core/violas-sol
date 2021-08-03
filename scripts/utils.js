// scripts/deploy_upgradeable_xxx.js
const fs    = require('fs');
const path  = require("path");
const { ethers, upgrades } = require("hardhat");

async function get_contract(name, address) {
    const cf = await ethers.getContractFactory(name);
    const c = await cf.attach(address);
    return c;
}

function get_files(pathname, ext) {
    let file_names = new Array();
    let files = fs.readdirSync(pathname)
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        stat = fs.statSync(path.join(pathname, file));
        if (stat.isFile()) {
            if (ext != undefined) {
                if (path.extname(path.join(pathname + file)) === ext) {
                    file_names.push(file);
                } 
            } else {
                file_names.push(file);
            }
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

function filename_parse(filename) {
    return {
        dirname:    path.dirname(filename),
        basename:   path.basename(filename),
        extname:    path.extname(filename),
        change_ext: function(ext) {
            return path.join(this.dirname, path.basename(this.basename, this.extname) + ext);
        }
    }
}

function filename_join(path, filename) {
    return path.join(path, filename);
}

function filename_change_ext(filename, ext) {
}
module.exports = {
    get_contract,
    file_exists,
    write_json,
    write_datas,
    mkdirs_sync,
    get_files,
    filename_change_ext,
    filename_join,
    filename_parse
}
