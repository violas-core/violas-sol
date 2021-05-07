const path = require("path");

configs = {
    defaultNetwork : "localhost",
    datas_path : "./datas",
    networks : {
        localhost: {
            contracts:"./jsons/contracts/vlscontract_localhost.json",
            tokens:"./jsons/tokens/erc20_tokens_localhost.json"
        },
        kovan: {
            contracts:"./jsons/contracts/vlscontract_kovan.json"
        },
        mainnet: {
            contracts:"./jsons/contracts/vlscontract_mainnet.json"
        },
    },
};

function vlscontract_conf() {
    filename = configs["networks"][configs.defaultNetwork].contracts;
    if (path.isAbsolute(filename)) {
        return filename;
    }

    return path.join(__dirname, configs["networks"][configs.defaultNetwork].contracts);
}

function tokens_conf() {
    filename = configs["networks"][configs.defaultNetwork].tokens;
    if (path.isAbsolute(filename)) {
        return filename;
    }

    var pathname =  path.join(__dirname, configs["networks"][configs.defaultNetwork].tokens);
    console.log(pathname);
    return pathname;
}

function caches(type) {
    if (configs.datas_path.length == 0) {
        configs.datas_path = ".";
    }
    return configs.datas_path + "/" + type + "/" + configs.defaultNetwork + "/";
}
module.exports = {
    configs,
    vlscontract_conf : vlscontract_conf(),
    caches_contracts : caches("contracts"),
    caches_tokens: caches("tokens"),
    tokens_conf : tokens_conf()
};

