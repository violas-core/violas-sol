// scripts/deploy_upgradeable_xxx.js
const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("./utils");
const violas    = require("../violas.config.js");
const bak_path  = violas.caches_contracts;
const {main, datas, state}  = require(violas.vlscontract_conf);
const {ethers, upgrades}    = require("hardhat");

async function date_format(dash = "-", colon = ":", space = " ") {
    return utils.date_format(dash, colon, space);
}

async function get_contract(name, address) {
    return await utils.get_contract(name, address);
}

async function show_msg(msg, title = "") {
    utils.show_msg(msg, title);
}

async function write_json(filename, data) {
    utils.write_json(filename, data);
}

async function signers(tokenName = "usdt") {
    let mcobj           = await get_contract(main.name, main.address);
    let proofAddress    = await mcobj.proofAddress();
    let tokenAddress    = await mcobj.tokenAddress(tokenName);
    let tcobj           = await get_contract("STDERC20", tokenAddress);
    const [owner, addr1, addr2] = await ethers.getSigners();

    let sdatas = [
        {
            address : owner.address,
            balance : (await tcobj.connect(owner).balanceOf(owner.address)).toString(),
        },
        {
            address : addr1.address,
            balance : (await tcobj.connect(addr1).balanceOf(addr1.address)).toString(),
        }
    ];
    utils.debug(sdatas, "signers");
}

async function __get_account(address) {
    const accounts = await ethers.getSigners();
    for(let i = 0; i < accounts.length; i++) {
        if (accounts[i].address == address) {
            return accounts[i];
        }
    }
    throw Error("not found account " + address);
}

async function new_proof(tokenName = "usdt") {
    let mcobj           = await get_contract(main.name, main.address);
    let proofAddress    = await mcobj.proofAddress();
    let tokenAddress    = await mcobj.tokenAddress(tokenName);
    let tcobj           = await get_contract("STDERC20", tokenAddress);
    let dcobj           = await get_contract(datas.name, proofAddress);
    //recever dd: 00000000000000000042524755534454
    vls_receiver        = "00000000000000000042524755534454";
    let owner           = await __get_account("0x89fF4a850e39A132614dbE517F80603b4A96fa0A");
    let datas_manager   = await __get_account(await dcobj.manager(0));
    let payer           = await __get_account("0x9382690D0B835b69FD9C0bc23EB772a0Ddb3613F");
    let payee           = await mcobj.payee();

    let info = {
        tokenName   : tokenName,
        address     : tokenAddress,
        symbol      : await tcobj.symbol(),
        dmanager    : datas_manager.address,
        mowner      : await mcobj.owner(),
        Payee       : payee,
        payeeBalance: (await tcobj.balanceOf(payee)).toString(),
        nextVersion : (await dcobj.nextVersion()).toString(),
        payer       : payer.address,
        payerBalance: (await tcobj.balanceOf(payer.address)).toString(),

    }
    utils.debug(info, "", {"type": "table"});


}

async function run() {
    utils.debug("start working...", "deploy or upgrade");
    await new_proof();
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
