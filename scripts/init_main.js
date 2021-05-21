// scripts/index.js
const utils  = require("./utils");
const logger = require("./logger");
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
        logger.warning("not found tokens conf.", "update_tokens");
        return;
    }
    const {tokens}= require(violas.tokens_conf);

    for(let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if(token.use) {
            let tokenAddress = await cobj.tokenAddress(token.name);
            if(tokenAddress != token.address && tokenAddress.length > 0) {
                await cobj.updateToken(token.name, token.address)
                logger.warning("upgrade " + token.name +" address: " + token.address);
            } else {
                logger.info(token.name + " address is already " + token.address);
            }
            let min = await cobj.tokenMinAmount(token.address);
            let max = await cobj.tokenMaxAmount(token.address);
            if (min != token.min) {
                await cobj.updateTokenMinAmount(token.address, token.min);
                logger.warning("upgrade " + token.name +" min: " + token.min);
            } else {
                logger.info(token.name + "(" + token.address + ") min is already " + min);
            }
            if (max != token.max) {
                await cobj.updateTokenMaxAmount(token.address, token.max);
                logger.warning("upgrade " + token.name +" max: " + token.max);
            } else {
                logger.info(token.name + "(" + token.address + ") max is already " + max);
            }

        }
    }
}

async function update_payee(cobj) {
    if (main.payee !== undefined && main.payee.length > 0) {
        if (main.payee != await cobj.payee()) {
            logger.warning("upgrade payee: " + main.payee);
            await cobj.transferPayeeship(main.payee);
        } else {
            logger.info(main.payee + " is already payee");
        }
    }
}
async function update_proof_address(cobj) {
    let proofAddress = await cobj.proofAddress();
    if (proofAddress != datas.address) {
        await cobj.upgradProofDatasAddress(datas.address);
        logger.warning("upgrade proof datas address: " + datas.address);
    } else {
        logger.info("The current datas address is already " + datas.address);
    }
}
async function run() {
    logger.debug("start working...", "init_main");
    let cobj = await get_contract(main.name, main.address);

    await update_proof_address(cobj);
    await update_tokens(cobj);
    await update_payee(cobj);
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
