const violas    = require("./violas.config.js");

const {main, datas, state} = require(violas.vlscontract_conf);

function get_address(name = "main") {
    switch(name) {
        case "main":
        return main.address;
    }
    throw Error(name + "is invalid. input [main, datas, state]");
}

module.exports = {
    get_address
}
