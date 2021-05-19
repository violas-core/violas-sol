const utils     = require("../utils");
const deploy    = require("./deploy.js");

async function main() {
    tokens = deploy.new_token_list();
    for (let i = 0; i < tokens.length; i++) {
        await deploy.deploy(tokens[i].name, tokens[i].symbol);
    }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
