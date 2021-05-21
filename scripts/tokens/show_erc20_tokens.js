const logger    = require("../logger");
const deploy    = require("./deploy.js");

async function main() {
    tokens = deploy.new_token_list();
    let infos = []
    for (let i = 0; i < tokens.length; i++) {
        logger.debug("get info: " + tokens[i].symbol);
        let address = tokens[i]["address"];
        if (address == undefined) continue;
        let dp = await deploy.get_contract(address);
        let symbol = await dp.symbol();
        infos.push({
            "name" :    await dp.name(),
            "symbol":   await dp.symbol(),
            "decimals": (await dp.decimals()).toString(),
            "totalSupply":  (await dp.totalSupply()).toString(),
        });
    }
    logger.table(infos);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
