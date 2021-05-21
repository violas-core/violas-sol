const violas    = require("../violas.config.js");
const markdown  = require("./markdown");
const logger    = require("./logger");
const utils     = require("./utils");

const {tokens}  = require(violas.tokens_conf);
const {main, datas, state} = require(violas.vlscontract_conf);


async function convert_tokens() {
    md_text = 
        markdown.new_markdown("tokens")
        .append_h1("mapping tokens in violas " + violas.network)
        .append_empty_line()
        .append_map_list(tokens)
        .text();
    md_file = 
        utils.filename_parse(violas.tokens_conf)
        .change_ext(".md");
    logger.info("update file: " + md_file);
    utils.write_datas(md_file, md_text);
}

async function convert_contract() {
    md_text = 
        markdown.new_markdown("contract")
        .append_h1("mapping contract in violas " + violas.network)
        .append_empty_line()
        .append_map_list([main, datas, state])
        .text();
    md_file = 
        utils.filename_parse(violas.vlscontract_conf)
        .change_ext(".md");
    logger.info("update file: " + md_file);
    utils.write_datas(md_file, md_text);
}

async function run() {
    logger.debug("start working...", "make jsons docs");
    await convert_tokens();
    await convert_contract();
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
