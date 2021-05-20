// scripts/index.js
const prompt    = require('prompt');
const utils     = require("./utils");

async function chain_env() {
    let sdatas = {
        network:    await ethers.provider.getNetwork(),
    }
    show_msg(sdatas, "chain");
}

async function tokens_info() {
    let tokens = [
        {name:"usdt",   address:"0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6},
        {name:"wbtc",   address:"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", decimals: 8},
        {name:"hbtc",   address:"0x0316EB71485b0Ab14103307bf65a021042c6d380", decimals: 18},
        {name:"renbtc", address:"0xeb4c2781e4eba804ce9a9803c67d0893436bb27d", decimals: 8},
        {name:"usdc",   address:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6},
        {name:"busd",   address:"0x4fabb145d64652a948d72533023f6e7a623c7c53", decimals: 18},
        {name:"dai",    address:"0x6b175474e89094c44da98b954eedeac495271d0f", decimals: 18},
        {name:"weth",   address:"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18},
        {name:"uni",    address:"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", decimals: 18},
        {name:"sushi",  address:"0x6b3595068778dd592e39a122f4f5a5cf09c90fe2", decimals: 18},
        {name:"link",   address:"0x514910771af9ca656af840dff83e8264ecf986ca", decimals: 18},
        {name:"comp",   address:"0xc00e94cb662c3520282e6f5717214004a7f26888", decimals: 18},
        {name:"aave",   address:"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", decimals: 18},
        {name:"bnb",    address:"0xB8c77482e45F1F44dE1745F52C74426C631bDD52", decimals: 18},
        {name:"wfil",   address:"0x6e1A19F235bE7ED8E3369eF73b196C07257494DE", decimals: 18}
    ]
    for(let i = 0; i < tokens.length; i++) {
        if (tokens[i].address.length <= 0 || 
            (tokens[i].decimals != undefined && tokens[i].decimals > 0)) continue;

        let cobj = await utils.get_contract("STDERC20", tokens[i].address);
        tokens[i]["decimals"] = (await cobj.decimals()).toString();
    }
    utils.table(tokens);
}

async function run() {
    utils.debug("start working...", "chain contract");
    await tokens_info();
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
