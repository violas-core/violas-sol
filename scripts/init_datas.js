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

async function run() {
    cobj = await get_contract(datas.name, datas.address);
    stateAddress = await cobj.stateAddress();
    mainAddress = await cobj.mainAddress();
    if (stateAddress != state.address) {
        await cobj.upgradStateAddress(state.address);
        utils.warning("upgrade state address: " + state.address);
    } else {
        utils.info("The current state address is already " + state.address);
    }

    if (mainAddress != main.address) {
        await cobj.upgradMainAddress(main.address);
        utils.warning("upgrade main address: " + main.address);
    } else {
        utils.info("The current main address is already " + main.address);
    }
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
