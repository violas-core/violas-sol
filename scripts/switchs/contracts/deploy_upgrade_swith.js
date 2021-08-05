// scripts/deploy_upgradeable_xxx.js
const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("../../utils");
const logger    = require("../../logger");
const violas    = require("../../../violas.config.js");
const bak_path  = violas.caches_contracts;
const {main, datas, state, nft721, nft1155}  = require(violas.vlscontract_conf);

function write_json(filename, data) {
    utils.write_json(filename, data);
}

function update_conf(filename) {
    data = {state : state, datas : datas, main : main, nft721: nft721, nft1155 : nft1155};
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
    data = {state : state, datas : datas, main : main, nft721 : nft721, nft1155 : nft1155};
    logger.table(data, violas.vlscontract_conf)
}

function show_conf_name() {
    logger.info(violas.vlscontract_conf, "file name")
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

function close_deploy_nft721(){
    close_deploy(nft721);
}

function close_deploy_nft1155(){
    close_deploy(nft1155);
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

function open_deploy_nft721() {
    open_deploy(nft721);
}

function open_deploy_nft1155() {
    open_deploy(nft1155);
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

function close_upgrade_nft721(){
    close_upgrade(nft721);
}

function close_upgrade_nft1155(){
    close_upgrade(nft1155);
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

function open_upgrade_nft721() {
    open_upgrade(nft721);
}

function open_upgrade_nft1155() {
    open_upgrade(nft1155);
}

function close_all_deploy() {
    close_deploy(state, false);
    close_deploy(main, false);
    close_deploy(datas, false);
    close_deploy(nft721, false);
    close_deploy(nft1155, false);
    update_conf(violas.vlscontract_conf);
}

function open_all_deploy() {
    open_deploy(state, false);
    open_deploy(main, false);
    open_deploy(datas, false);
    open_deploy(nft721, false);
    open_deploy(nft1155, false);
    update_conf(violas.vlscontract_conf);
}

function close_all_upgrade() {
    close_upgrade(state, false);
    close_upgrade(main, false);
    close_upgrade(datas, false);
    close_upgrade(nft721, false);
    close_upgrade(nft1155, false);
    update_conf(violas.vlscontract_conf);
}

function open_all_upgrade() {
    open_upgrade(state, false);
    open_upgrade(main, false);
    open_upgrade(datas, false);
    open_upgrade(nft721, false);
    open_upgrade(nft1155, false);
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

function close_nft721() {
    close_deploy(nft721, false);
    close_upgrade(nft721, false);
    update_conf(violas.vlscontract_conf);
}

function close_nft1155() {
    close_deploy(nft1155, false);
    close_upgrade(nft1155, false);
    update_conf(violas.vlscontract_conf);
}

module.exports = {
    close_all,
    close_main,
    close_datas,
    close_state,
    close_nft721,
    close_nft1155,
    close_deploy_datas,
    close_deploy_main,
    close_deploy_state,
    close_deploy_nft721,
    close_deploy_nft1155,
    close_all_deploy,
    open_deploy_datas,
    open_deploy_main,
    open_deploy_state,
    open_deploy_nft721,
    open_deploy_nft1155,
    open_all_deploy,
    close_upgrade_datas,
    close_upgrade_main,
    close_upgrade_state,
    close_upgrade_nft721,
    close_upgrade_nft1155,
    close_all_upgrade,
    open_upgrade_datas,
    open_upgrade_main,
    open_upgrade_state,
    open_upgrade_nft721,
    open_upgrade_nft1155,
    open_all_upgrade,
    show_conf,
    show_conf_name
}
