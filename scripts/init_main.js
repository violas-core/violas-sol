// scripts/index.js
const utils = require("./utils");
const violas = require("../violas.config.js");
const vlscontract_conf = violas.vlscontract_conf;
const {main, datas, state} = require(vlscontract_conf);

async function show_accounts() {
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts);
}

async function get_contract(name, address) {
    return await utils.get_contract(name, address);
}

async function show_msg(msg, title = "") {
    utils.show_msg(msg, title);
}

async function run() {
    cobj = await get_contract(main.name, main.address);
    proofAddress = await cobj.proofAddress();
    if (proofAddress != datas.address) {
        await cobj.upgradProofDatasAddress(datas.address);
        show_msg("upgrade proof datas address: " + datas.address);
    } else {
        show_msg("The current datas address is already " + datas.address);
    }
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
