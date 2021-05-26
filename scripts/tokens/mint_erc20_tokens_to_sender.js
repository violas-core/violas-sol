const logger    = require("../logger");
const deploy    = require("./deploy.js");
const violas    = require("../../violas.config.js");
const { ethers, upgrades } = require("hardhat");

async function mint(target_address, defamount = 10) {
    tokens = deploy.new_token_list();
    let infos = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].address == undefined || tokens[i].address.length == 0) continue; 
        logger.debug("start mint " + tokens[i].symbol + " for " + target_address);

        let dp = await deploy.get_contract(tokens[i].address);
        let amount = ethers.BigNumber.from((Math.pow(defamount, await dp.decimals())).toString() + 1000000);
        
        let info = {
            tokenSymbol: tokens[i].symbol,
            tokenAddress: tokens[i].address,
            currentAmount: (await dp.balanceOf(target_address)).toString(),
        }
        await dp.mint(target_address, amount);
        info["newAmount"] = (await dp.balanceOf(target_address)).toString();
        infos.push(info);
        logger.table(info);

    }
    logger.table(infos, "internal sender")
}

async function main() {
    let addresses = new Array();

    if (violas.network == "internal") {
        addresses.push("0x49999B466D7d139f88E8eFea87A6D4D227Fb243e");
    } else if (violas.network == "external") {
        addresses.push("0x5ea3C8B916aD54E5755a65E47709dD299C10641c");
        addresses.push("0x64a5E8e26084Fd9ec9BcA5B080dD6ae071A2D44e");
    } else {
        throw Error("network " + violas.network + " not supported");
    }

    for (let i = 0; i < addresses.length; i++) {
        await mint(addresses[i]);
    }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
