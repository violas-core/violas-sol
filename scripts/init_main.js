// scripts/index.js
const utils = require("./utils");
const violas = require("../violas.config.js");
const vlscontract_conf = violas.vlscontract_conf;
const {main, datas, state} = require(vlscontract_conf);
const {tokens}= require(violas.tokens_conf);

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

async function update_tokens(cobj) {
    for(var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if(token.use) {
            var tokenAddress = await cobj.tokenAddress(token.name);
            if(tokenAddress != token.address && tokenAddress.length > 0) {
                await cobj.updateToken(token.name, token.address)
                show_msg("upgrade " + token.name +" address: " + token.address);
                show_msg("tokens address: " + await cobj.tokenAddress(token.name));
            } else {
                show_msg(token.name + " address is already " + token.address);
            }
            min = await cobj.tokenMinAmount(token.address);
            max = await cobj.tokenMaxAmount(token.address);
            if (min != token.min) {
                await cobj.updateTokenMinAmount(token.address, token.min);
                show_msg("upgrade " + token.name +" min: " + token.min);
            } else {
                show_msg(token.name + "(" + token.address + ") min is already " + min);
            }
            if (max != token.max) {
                await cobj.updateTokenMaxAmount(token.address, token.max);
                show_msg("upgrade " + token.name +" max: " + token.max);
            } else {
                show_msg(token.name + "(" + token.address + ") max is already " + max);
            }
        }
    }
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

    await update_tokens(cobj);
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
