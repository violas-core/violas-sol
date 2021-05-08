// scripts/deploy_upgradeable_xxx.js
const fs = require('fs');
const path = require("path");
const { ethers, upgrades } = require("hardhat");

function date_format(dash = "-", colon = ":", space = " ") {
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

function create_split_symbol(weight = 80, symbol = "-", end_symbol = ":") {
    var line = "";
    for(var i = 0; i < weight; i++) line += symbol;
    line += end_symbol;
    return line;
}

function add_color(msg, color) {
    tcolor = styles[color];
    return tcolor[0] + msg + tcolor[1];
}
function get_kwargs(kwargs, name, defvalue = "") {
    if (kwargs == undefined || kwargs[name] == undefined) {
        return defvalue;
    } else {
        return kwargs[name];
    }
}

function error(msg, title = "") {
    show_msg(msg, title, {"type":"log", "color":"red"});
}

function warning(msg, title = "") {
    show_msg(msg, title, {"type":"log", "color":"yellow"});
}

function debug(msg, title = "") {
    show_msg(msg, title, {"type":"log"});
}

function info(msg, title = "") {
    show_msg(msg, title, {"type":"log", "color":"blue"});
}

function show_msg(msg, title = "", kwargs = {}) {
    type        = get_kwargs(kwargs, "type", "log");
    title_color = get_kwargs(kwargs, "title_color", "red");
    color       = get_kwargs(kwargs, "color", "");
    format      = get_kwargs(kwargs, "format", true);

    if (title.length > 0) {
        console.log(create_split_symbol() + add_color(title, title_color));
    }

    if (format) {
        msg = JSON.stringify(msg);
        msg = date_format() + ": " + add_color(msg, color);
    }
    if (type == "table" || type == "t") {
        console.table(msg);
    } else {
        console.log(msg);
    }
}

function write_json(filename, data) {
    save_data = JSON.stringify(data, null, "\t");
    if (fs.existsSync(filename)) {
        fs.writeFileSync(filename, save_data);
    } else {
        fs.writeFileSync(filename, save_data);
    }
    return true;
}
const styles = {
    '': ['', ''],
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'strikethrough': ['\x1B[9m', '\x1B[29m'],
    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],
    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};

module.exports = {
    date_format,
    get_contract,
    show_msg,
    write_json,
    add_color,
    info,
    debug,
    warning,
    error
}
