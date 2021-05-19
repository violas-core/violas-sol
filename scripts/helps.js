const utils = require("./utils");
args = [
    {
        "name":     "help",
        "value":    "",
        "desc":     "show this help",
        "premise":  ""
    },
    {
        "name":     "use_solc",
        "value":    "true(default) | false.",
        "desc":     "build use solc or hardhat, use_solc=true: use solc; use_solc=false: use hardhat",
        "premise":  "",
    },
    {
        "name":     "select",
        "value":    "v=0.8.0",
        "desc":     "select solc version, v=[0.6.0 | 0.8.0 | ...]",
        "premise":  "use_solc=true",
    },
    {
        "name":     "install",
        "value":    "v=0.8.0",
        "desc":     "install solc with version, v=[0.6.0 | 0.8.0 | ...]",
        "premise":  "use_solc=true",
    },
    {
        "name":     "clean",
        "value":    "",
        "desc":     "clean build result",
        "premise":  "",
    },
    {
        "name":     "build",
        "value":    "",
        "desc":     "build contracts",
        "premise":  "",
    },
    {
        "name":     "deploy",
        "value":    "",
        "desc":     "deploy contracts with jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "upgrade",
        "value":    "",
        "desc":     "upgrade contracts with jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "init",
        "value":    "",
        "desc":     "init main and datas contract with jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "init_main",
        "value":    "",
        "desc":     "init main contract with jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "init_datas",
        "value":    "",
        "desc":     "init datas contract with jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "show_chain_contract",
        "value":    "",
        "desc":     "show contracts info in blockchain(chain = hardhat.conf.js:defaultNetwork)",
        "premise":  "hardhat.conf.js:defaultNetwork",
    },
    {
        "name":     "open",
        "value":    "target=[deploy | upgrade] index=[main | datas | state]",
        "desc":     "open switchs in jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "close",
        "value":    "[target=[deploy | upgrade | | all]] index=[main | datas | state |]",
        "desc":     "open switchs in jsons/contracts/vlscontract_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "use",
        "value":    "target=[usdt | wbtc |...]",
        "desc":     "open switch(use=true) in jsons/tokens/erc20_tokens_NETWORK.json",
        "premise":  "init_tokens_script",
    },
    {
        "name":     "unuse",
        "value":    "target=[usdt | wbtc |...| all]",
        "desc":     "close switch(use=true) in jsons/tokens/erc20_tokens_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "init_tokens_script",
        "value":    "",
        "desc":     "create open_TOKENNAME.js/close_TOKENNAME.js for use/unuse json/tokens/erc20_tokens_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "clean_tokens_script",
        "value":    "",
        "desc":     "clean open_TOKENNAME.js/close_TOKENNAME.js",
        "premise":  "",
    },
    {
        "name":     "show_tokens",
        "value":    "",
        "desc":     "show jsons/tokens/erc20_tokens_NETWORK.json info",
        "premise":  "",
    },
    {
        "name":     "show_contracts",
        "value":    "",
        "desc":     "show jsons/contracts/vlscontract_NETWORK.json info",
        "premise":  "",
    },
    {
        "name":     "deploys_erc20",
        "value":    "",
        "desc":     "deploys erc20 tokens jsons/tokens/deploys/erc20_tokens_NETWORK.json",
        "premise":  "",
    },
    {
        "name":     "show_deploys",
        "value":    "",
        "desc":     "show deploys erc20 tokens jsons/tokens/deploys/erc20_tokens_NETWORK.json",
        "premise":  "",
    },
]
name_kwargs     = {"format": false}
value_kwargs    = {"format": false, "color": "yellow"}
desc_kwargs     = {"format": false, "color": ""}
premise_kwargs  = {"format": false, "color": "red"}
alig = "\t\t";

utils.show_msg("Usage: make OPTION ARGS");
for (let i = 0; i < args.length; i++) {
    utils.show_msg(args[i].name,  "", name_kwargs);
    if (args[i].value) utils.show_msg(alig + "value:\t"    + args[i].value,    "", value_kwargs);
    if (args[i].desc)    utils.show_msg(alig + args[i].desc,                     "", desc_kwargs);
    if (args[i].premise) utils.show_msg(alig + "premise:\t"  +  args[i].premise, "", premise_kwargs);
}

