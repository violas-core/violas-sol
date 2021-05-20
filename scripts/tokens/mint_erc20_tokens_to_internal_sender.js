//0x49999B466D7d139f88E8eFea87A6D4D227Fb243e
const utils     = require("../utils");
const deploy    = require("./deploy.js");
const { ethers, upgrades } = require("hardhat");

const target_address = "0x49999B466D7d139f88E8eFea87A6D4D227Fb243e";
async function main() {
    tokens = deploy.new_token_list();
    let infos = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].address == undefined || tokens[i].address.length == 0) continue; 
        utils.debug("start mint " + tokens[i].symbol + " for " + target_address);

        let dp = await deploy.get_contract(tokens[i].address);
        let amount = ethers.BigNumber.from((Math.pow(10, await dp.decimals())).toString() + 1000000);
        
        let info = {
            tokenSymbol: tokens[i].symbol,
            tokenAddress: tokens[i].address,
            currentAmount: (await dp.balanceOf(target_address)).toString(),
        }
        await dp.mint(target_address, amount);
        info["newAmount"] = (await dp.balanceOf(target_address)).toString();
        infos.push(info);
        utils.table(info);

    }
    utils.table(infos, "internal sender")

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
