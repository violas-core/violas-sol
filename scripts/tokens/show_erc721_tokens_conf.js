// scripts/deploy_upgradeable_xxx.js
const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const logger    = require("../logger");
const violas    = require("../../violas.config.js");
const bak_path  = violas.caches_erc721_tokens;
const {tokens}  = require(violas.erc721_tokens_conf);

base = {
    "network" : violas.network,
    "bakpath" : bak_path,
}

logger.table(base, "base info");
logger.table(tokens, "deploys tokens erc721");
