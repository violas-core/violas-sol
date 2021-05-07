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
    utils.show_msg(msg, title, false, "table");
}

async function datas_env() {
    cobj = await get_contract(datas.name, datas.address);
    sdatas = {
        name: datas.name,
        contractname: await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: datas.address,
        stateAddress : await cobj.stateAddress(),
        mainAddress : await cobj.mainAddress(),
        owner : await cobj.owner(),
    }
    show_msg(sdatas, "datas");
}

async function main_env() {
    cobj = await get_contract(main.name, main.address);
    sdatas = {
        name: main.name,
        contractname: await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: main.address,
        proofAddress : await cobj.proofAddress(),
        payee: await cobj.payee(),
        owner : await cobj.owner(),
    }
    show_msg(sdatas, "main");

    validTokens = {};
    tokenMaxCount = await cobj.tokenMaxCount();
    show_msg("tokens count: " + tokenMaxCount);
    show_msg("tokens address: " + await cobj.tokenAddress("usdt"));
    for(var i = 0; i< tokenMaxCount; i++) {
        tokenName = await cobj.validTokenNames(i);
        show_msg("tokens name: " + tokenName);
        if(tokenName.length > 0) {
            validTokens[tokenName] = await cobj.tokenAddress(tokenName);
            var min = await cobj.tokenMinAmount(validTokens[tokenName]);
            var max = await cobj.tokenMaxAmount(validTokens[tokenName]); 
            validTokens[tokenName + "_min"] = min;
            validTokens[tokenName + "_max"] = max;
        }
    }
    show_msg(validTokens, "main.tokens");
}

async function state_env() {
    cobj = await get_contract(state.name, state.address);
    sdatas = {
        name: state.name,
        contractname: await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: state.address,
        owner : await cobj.owner(),
    }
    show_msg(sdatas, "state");
}
async function run() {
    await state_env();
    await datas_env();
    await main_env();
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
