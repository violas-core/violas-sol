const utils     = require("../utils");
const deploy    = require("./deploy.js");

async function main() {
    tokens = deploy.new_token_list();
    for (let i = 0; i < tokens.length; i++) {
        let address = tokens[i]["address"];
        utils.table(tokens[i], "deploy:" + tokens[i].symbol)
        if (tokens[i].create == undefined || tokens[i].create) {
            let decimals = tokens[i].decimals == undefined || tokens[i].decimals <= 0 ? 18 : tokens[i].decimals;
            let dp = await deploy.deploy(tokens[i].name, tokens[i].symbol, decimals);
            address = dp.address;
        }
    
        if (tokens[i].mint == undefined || tokens[i].mint > 0) {
            let dp = await deploy.get_contract(address);
            let decimals = Math.pow(10, await dp.decimals());
            let amount = tokens[i].mint == undefined ? 1000000 * decimals : tokens[i].mint * decimals;
            utils.info("mint " + tokens[i].symbol + " amount = " + amount);
            await dp.mint(address, amount);
        }
    }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
