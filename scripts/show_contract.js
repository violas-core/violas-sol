// scripts/index.js
const prompt    = require('prompt');
const utils     = require("./utils");
const logger    = require("./logger");
const violas    = require("../violas.config.js");
const vlscontract_conf = violas.vlscontract_conf;
const {main, datas, state, nft721} = require(vlscontract_conf);

async function get_contract(name, address) {
    return await utils.get_contract(name, address);
}

async function show_msg(msg, title = "") {
    logger.show_msg(msg, title, {"format": false, "type": "table"});
}

async function chain_env() {
    let sdatas = {
        network:    await ethers.provider.getNetwork(),
    }
    show_msg(sdatas, "chain");
}

async function account_info() {
    const accounts = await ethers.provider.listAccounts();

    let sdatas = {};
    for(let i = 0; i < accounts.length; i++) {
        sdatas[accounts[i]] = (await ethers.provider.getBalance(accounts[i])).toString();
    }
    show_msg(sdatas, "accounts");
}

async function datas_env() {
    let cobj = await get_contract(datas.name, datas.address);
    let managers = "";
    for (let i = 0; i < await cobj.managerMaxCount(); i++) {
        manager = await cobj.manager(i);
        if (await cobj.manageRoleState(manager)) {
            managers += manager + " ";
        }
    }

    let sdatas = {
        name:           datas.name,
        contractname:   await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: datas.address,
        stateAddress:   await cobj.stateAddress(),
        mainAddress:    await cobj.mainAddress(),
        owner:          await cobj.owner(),
        proofVersion:   (await cobj.nextVersion()).toString(),
        manager:        managers,
    }
    show_msg(sdatas, "datas");
}

async function latest_proof() {
    let cobj = await get_contract(datas.name, datas.address);
    let managers = "";
    let last_version = await cobj.nextVersion();
    if (last_version > 0) {
        let proof = await cobj.proofInfo(last_version - 1);
        
        let proof_formt = []
        for (let i = 0; i < proof.length; i++) {
            proof_formt.push(proof[i].toString());
        }
        show_msg(proof_formt, "latest proof: version = " + (last_version - 1));
    } else {
        logger.info("no proof data");
    }
}

async function main_env() {
    let cobj = await get_contract(main.name, main.address);
    let sdatas = {
        name:           main.name,
        contractname:   await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: main.address,
        proofAddress:   await cobj.proofAddress(),
        payee:          await cobj.payee(),
        owner:          await cobj.owner(),
    }
    show_msg(sdatas, "main");

    let validTokens = {};
    let tokenMaxCount = await cobj.tokenMaxCount();
    for(let i = 0; i< tokenMaxCount; i++) {
        let tokenName = await cobj.validTokenNames(i);
        let validToken = {};
        if(tokenName.length > 0) {
            logger.debug("get token " + tokenName + " info...")
            validToken["address"] = await cobj.tokenAddress(tokenName);
            let min = await cobj.tokenMinAmount(validToken["address"]);
            let max = await cobj.tokenMaxAmount(validToken["address"]); 
            validToken["min"] = min.toString();
            validToken["max"] = max.toString();
        }
        validTokens[tokenName] = validToken;
    }
    show_msg(validTokens, "main.tokens");
}

async function state_env() {
    let cobj = await get_contract(state.name, state.address);
    let sdatas = {
        name: state.name,
        contractname: await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: state.address,
        owner : await cobj.owner(),
    }
    show_msg(sdatas, "state");
}

async function nft721_env() {
    let cobj = await get_contract(nft721.name, nft721.address);
    let sdatas = {
        name: nft721.name,
        contractname: await cobj.name(),
        contractsymbol: await cobj.symbol(),
        contractAddress: nft721.address,
    }
    show_msg(sdatas, "nft721");
}
async function run() {
    logger.debug("start working...", "chain contract");
    await latest_proof();
    await chain_env();
    await account_info();
    await state_env();
    await datas_env();
    await main_env();
    await nft721_env();
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
