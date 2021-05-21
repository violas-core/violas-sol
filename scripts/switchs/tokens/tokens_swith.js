const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("../../utils");
const logger    = require("../../logger");
const violas    = require("../../../violas.config.js");
const {tokens}  = require(violas.tokens_conf);

function update_conf(filename) {
    data = {tokens};
    utils.write_json(filename, data);
}

function close_token(item, save = true) {
    if (item.use) {
        item.use= false;
        if(save) update_conf(violas.tokens_conf);
    }
}

function open_token(item, save = true) {
    if (!item.use) {
        item.use= true;
        if(save) update_conf(violas.tokens_conf);
    }
}

function update_min(item, min, save = true) {
    if (item.min != min) {
        item.min = min;
        if(save) update_conf(violas.tokens_conf);
    }
}

function update_max(item, max, save = true) {
    if (item.max != max) {
        item.max = max;
        if(save) update_conf(violas.tokens_conf);
    }
}

function show_conf() {
    logger.table(tokens, violas.tokens_conf)
}


function close_token_with_name(name) {
    for(let i = 0; i < tokens.length; i++) {
        if (tokens[i].name == name) {
            close_token(tokens[i])
            return true;
        }
    }
    return false;
}

function open_token_with_name(name) {
    for(let i = 0; i < tokens.length; i++) {
        if (tokens[i].name == name) {
            open_token(tokens[i])
            return true;
        }
    }
    return false;
}

function close_all() {
    for(let i = 0; i < tokens.length; i++) {
        close_token(tokens[i], false)
    }
    update_conf(violas.tokens_conf);
    return false;
}

function update_token_min_with_name(name, min) {
    for(let i = 0; i < tokens.length; i++) {
        if (tokens[i].name == name) {
            update_min(tokens[i], min);
            return true;
        }
    }
    return false;
}

function update_token_max_with_name(name, min) {
    for(let i = 0; i < tokens.length; i++) {
        if (tokens[i].name == name) {
            update_max(tokens[i], min);
            return true;
        }
    }
    return false;
}

function show_conf_name() {
    logger.table(violas.tokens_conf, "file name")
}

function create_open_script(token, always = false, basepath = "") {
    let filename = path.join(basepath, "open_" + token + ".js");
    let script = "const switchs = require(\"./tokens_swith.js\");\nswitchs.open_token_with_name(\"" + token + "\");";
    if (!utils.file_exists(filename) || always) {
        logger.debug("create_open_script: " + filename);
        utils.write_datas(filename, script);
    }
}

function create_close_script(token, always = false, basepath = "") {
    let filename = path.join(basepath,  "close_" + token + ".js");
    let script = "const switchs = require(\"./tokens_swith.js\");\nswitchs.close_token_with_name(\"" + token + "\");";
    if (!utils.file_exists(filename) || always) {
        logger.debug("create_close_script: " + filename);
        utils.write_datas(filename, script);
    }
}

function create_token_script(token, basepath = "./", always = false) {
    if (basepath != undefined && !path.isAbsolute(basepath)) {
        basepath = path.join(__dirname, basepath);
    }
    create_open_script(token, always, basepath);
    create_close_script(token, always, basepath);
}

function token_names() {
    let names = new Array();
    for (let i = 0; i < tokens.length; i++) {
        names.push(tokens[i].name);
    }
    return names;
}

module.exports = {
    close_all,
    close_token_with_name,
    open_token_with_name,
    update_token_min_with_name,
    update_token_max_with_name,
    show_conf,
    show_conf_name,
    create_token_script,
    token_names
}
