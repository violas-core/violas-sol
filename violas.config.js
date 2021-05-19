const path = require("path");
const hardhat_conf= require("./hardhat.config.js");

configs = {
    defaultNetwork : hardhat_conf.defaultNetwork,
    datas_path : "./datas",
    networks : {
        localhost: {
            contracts:"./jsons/contracts/vlscontract_localhost.json",
            tokens:"./jsons/tokens/erc20_tokens_localhost.json",
            newtokens:"./jsons/tokens/deploys/erc20_tokens_localhost.json"
        },
        internal: {
            contracts:"./jsons/contracts/vlscontract_internal.json",
            tokens:"./jsons/tokens/erc20_tokens_internal.json",
            newtokens:"./jsons/tokens/deploys/erc20_tokens_internal.json"
        },
        external: {
            contracts:"./jsons/contracts/vlscontract_external.json",
            tokens:"./jsons/tokens/erc20_tokens_external.json",
            newtokens:"./jsons/tokens/deploys/erc20_tokens_external.json"
        },
        mainnet: {
            contracts:"./jsons/contracts/vlscontract_mainnet.json"
        },
    },
};
function conf_filename(name) {
    filename = configs["networks"][configs.defaultNetwork][name];
    if (filename == undefined || path.isAbsolute(filename)) {
        return filename;
    }

    var pathname =  path.join(__dirname, configs["networks"][configs.defaultNetwork][name]);
    return pathname;
}
function vlscontract_conf() {
    /*filename = configs["networks"][configs.defaultNetwork].contracts;
    if (filename == undefined || path.isAbsolute(filename)) {
        return filename;
    }

    return path.join(__dirname, configs["networks"][configs.defaultNetwork].contracts);
    */
    return conf_filename("contracts");
}

function tokens_conf() {
    /*
    filename = configs["networks"][configs.defaultNetwork].tokens;
    if (filename == undefined || path.isAbsolute(filename)) {
        return filename;
    }

    var pathname =  path.join(__dirname, configs["networks"][configs.defaultNetwork].tokens);
    return pathname;
    */
    return conf_filename("tokens");
}

function erc20_tokens_conf() {
    /*
    filename = configs["networks"][configs.defaultNetwork].newtokens;
    if (filename == undefined || path.isAbsolute(filename)) {
        return filename;
    }

    var pathname =  path.join(__dirname, configs["networks"][configs.defaultNetwork].newtokens);
    return pathname;
    */
    return conf_filename("newtokens");
}

function caches(type) {
    if (configs.datas_path.length == 0) {
        configs.datas_path = ".";
    }
    return configs.datas_path + "/" + type + "/" + configs.defaultNetwork + "/";
}
module.exports = {
    configs,
    network : configs.defaultNetwork,
    vlscontract_conf : conf_filename("contracts"),
    caches_contracts : caches("contracts"),
    caches_tokens: caches("tokens"),
    tokens_conf : conf_filename("tokens"), //main use
    caches_erc20_tokens: caches("erc20_tokens_deploys"),
    erc20_tokens_conf : conf_filename("newtokens")
};

