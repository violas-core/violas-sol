// scripts/deploy_upgradeable_xxx.js
const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("../../utils");
const violas    = require("../../../violas.config.js");
const bak_path  = violas.caches_contracts;
const {main, datas, state}  = require(violas.vlscontract_conf);

function date_format(dash = "-", colon = ":", space = " ") {
    return utils.date_format(dash, colon, space);
}

function show_msg(msg, title = "") {
    utils.show_msg(msg, title, {"format": false, "type": "table"});
}

function write_json(filename, data) {
    utils.write_json(filename, data);
}

function update_conf(filename) {
    data = {state : state, datas : datas, main : main};
    write_json(filename, data);
}

function close_deploy(item, save = true) {
    if (item.deploy) {
        item.deploy = false;
        if(save) update_conf(violas.vlscontract_conf);
    }
}
function close_upgrade(item, save = true) {
    if (item.upgrade) {
        item.upgrade= false;
        if(save) update_conf(violas.vlscontract_conf);
    }
}

function show_conf() {
    if (main.manager != undefined) {
        let managers = ""
        for (let i = 0; i < main.manager.length; i++) {
            managers += main.manager[i];
        }
        main.manager = managers;
    }
    data = {state : state, datas : datas, main : main};
    show_msg(data, violas.vlscontract_conf)
}

function show_conf_name() {
    show_msg(violas.vlscontract_conf, "file name")
}

function open_deploy(item, save = true) {
    if (!item.deploy) {
        item.deploy = true;
        if(save) update_conf(violas.vlscontract_conf);
    }
}
function open_upgrade(item, save = true) {
    if (!item.upgrade) {
        item.upgrade= true;
        if(save) update_conf(violas.vlscontract_conf);
    }
}

function close_deploy_main(){
    close_deploy(main);
}

function close_deploy_datas(){
    close_deploy(datas);
}

function close_deploy_state(){
    close_deploy(state);
}

function open_deploy_main() {
    open_deploy(main);
}

function open_deploy_datas() {
    open_deploy(datas);
}

function open_deploy_state() {
    open_deploy(state);
}

function close_upgrade_main(){
    close_upgrade(main);
}

function close_upgrade_datas(){
    close_upgrade(datas);
}

function close_upgrade_state(){
    close_upgrade(state);
}

function open_upgrade_main() {
    open_upgrade(main);
}

function open_upgrade_datas() {
    open_upgrade(datas);
}

function open_upgrade_state() {
    open_upgrade(state);
}

function close_all_deploy() {
    close_deploy(state, false);
    close_deploy(main, false);
    close_deploy(datas, false);
    update_conf(violas.vlscontract_conf);
}

function open_all_deploy() {
    open_deploy(state, false);
    open_deploy(main, false);
    open_deploy(datas, false);
    update_conf(violas.vlscontract_conf);
}

function close_all_upgrade() {
    close_upgrade(state, false);
    close_upgrade(main, false);
    close_upgrade(datas, false);
    update_conf(violas.vlscontract_conf);
}

function open_all_upgrade() {
    open_upgrade(state, false);
    open_upgrade(main, false);
    open_upgrade(datas, false);
    update_conf(violas.vlscontract_conf);
}

function close_all() {
    close_all_deploy();
    close_all_upgrade();
}

function close_main() {
    close_deploy(main, false);
    close_upgrade(main, false);
    update_conf(violas.vlscontract_conf);
}

function close_datas() {
    close_deploy(datas, false);
    close_upgrade(datas, false);
    update_conf(violas.vlscontract_conf);
}

function close_state() {
    close_deploy(state, false);
    close_upgrade(state, false);
    update_conf(violas.vlscontract_conf);
}

module.exports = {
    close_all,
    close_main,
    close_datas,
    close_state,
    close_deploy_datas,
    close_deploy_main,
    close_deploy_state,
    close_all_deploy,
    open_deploy_datas,
    open_deploy_main,
    open_deploy_state,
    open_all_deploy,
    close_upgrade_datas,
    close_upgrade_main,
    close_upgrade_state,
    close_all_upgrade,
    open_upgrade_datas,
    open_upgrade_main,
    open_upgrade_state,
    open_all_upgrade,
    show_conf,
    show_conf_name
}
