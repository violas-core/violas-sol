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

    for(let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if(token.use) {
            let tokenAddress = await cobj.tokenAddress(token.name);
            if(tokenAddress != token.address && tokenAddress.length > 0) {
                await cobj.updateToken(token.name, token.address)
                utils.warning("upgrade " + token.name +" address: " + token.address);
            } else {
                utils.info(token.name + " address is already " + token.address);
            }
            let min = await cobj.tokenMinAmount(token.address);
            let max = await cobj.tokenMaxAmount(token.address);
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

            if (main.payee !== undefined && main.payee.length > 0) {
                if (main.payee != await cobj.payee()) {
                    utils.warning("upgrade payee: " + main.payee);
                    await cobj.transferPayeeship(main.payee);
                } else {
                    utils.info(main.payee + " is already payee");
                }
            }
        }
    }
}

async function update_proof_address(cobj) {
    let proofAddress = await cobj.proofAddress();
    if (proofAddress != datas.address) {
        await cobj.upgradProofDatasAddress(datas.address);
        utils.warning("upgrade proof datas address: " + datas.address);
    } else {
        utils.info("The current datas address is already " + datas.address);
    }
}
async function run() {
    utils.debug("start working...", "init_main");
    let cobj = await get_contract(main.name, main.address);

    await update_proof_address(cobj);
    await update_tokens(cobj);
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
