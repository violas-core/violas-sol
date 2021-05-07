const path = require("path");

configs = {
    defaultNetwork : "localhost",
    datas_path : "./datas",
    networks : {
        localhost: {
            config:"vlscontract_localhost.json"
        },
        kovan: {
            config:"vlscontract_kovan.json"
        },
        mainnet: {
            config:"vlscontract_mainnet.json"
        },
    },
};

function vlscontract_conf() {
    filename = configs["networks"][configs.defaultNetwork].config;
    if (path.isAbsolute(filename)) {
        return filename;
    }

    return path.join(__dirname, configs["networks"][configs.defaultNetwork].config);
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
    caches
};

