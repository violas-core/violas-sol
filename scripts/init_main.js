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

async function update_tokens(cobj) {
    if(violas.tokens_conf == undefined) {
        utils.warning("not found tokens conf.", "update_tokens");
        return;
    }
    const {tokens}= require(violas.tokens_conf);

    for(var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if(token.use) {
            var tokenAddress = await cobj.tokenAddress(token.name);
            if(tokenAddress != token.address && tokenAddress.length > 0) {
                await cobj.updateToken(token.name, token.address)
                utils.warning("upgrade " + token.name +" address: " + token.address);
            } else {
                utils.info(token.name + " address is already " + token.address);
            }
            min = await cobj.tokenMinAmount(token.address);
            max = await cobj.tokenMaxAmount(token.address);
            if (min != token.min) {
                await cobj.updateTokenMinAmount(token.address, token.min);
                utils.warning("upgrade " + token.name +" min: " + token.min);
            } else {
                utils.info(token.name + "(" + token.address + ") min is already " + min);
            }
            if (max != token.max) {
                await cobj.updateTokenMaxAmount(token.address, token.max);
                utils.warning("upgrade " + token.name +" max: " + token.max);
            } else {
                utils.info(token.name + "(" + token.address + ") max is already " + max);
            }
        }
    }
}

async function update_proof_address(cobj) {
    proofAddress = await cobj.proofAddress();
    if (proofAddress != datas.address) {
        await cobj.upgradProofDatasAddress(datas.address);
        utils.warning("upgrade proof datas address: " + datas.address);
    } else {
        utils.info("The current datas address is already " + datas.address);
    }
}
async function run() {
    utils.debug("start working...", "init_main");
    cobj = await get_contract(main.name, main.address);

    await update_proof_address(cobj);
    await update_tokens(cobj);
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
