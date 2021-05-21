// scripts/deploy_upgradeable_xxx.js
const violas    = require("../violas.config.js");
const markdown  = require("./markdown");
const logger    = require("./logger");

const {tokens}  = require(violas.tokens_conf);
const {main, datas, state} = require(violas.vlscontract_conf);


async function convert_tokens() {
    let datas = markdown.convert_json_to_markdown(tokens);
    logger.lines(datas);
}
async function run() {
    logger.debug("start working...", "make jsons docs");
    await convert_tokens();
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
