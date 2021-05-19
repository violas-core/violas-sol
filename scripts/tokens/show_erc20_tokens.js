// scripts/deploy_upgradeable_xxx.js
const fs        = require('fs');
const path      = require("path");
const program   = require('commander');
const utils     = require("../utils");
const violas    = require("../../violas.config.js");
const bak_path  = violas.caches_erc20_tokens;
const {tokens}  = require(violas.erc20_tokens_conf);

base = {
    "network" : violas.network,
    "bakpath" : bak_path
}

utils.table(base, "base info");
utils.table(tokens, "deploys tokens");
