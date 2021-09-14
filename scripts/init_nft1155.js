// scripts/index.js
const utils  = require("./utils");
const logger = require("./logger");
const violas = require("../violas.config.js");
const vlscontract_conf = violas.vlscontract_conf;
const {main, datas, state, nft721, nft1155} = require(vlscontract_conf);


async function show_accounts() {
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts);
}

async function get_contract(name, address) {
    return await utils.get_contract(name, address);
}

async function show_msg(msg, title = "") {
    logger.show_msg(msg, title, {"type": "json"});
}

function get_nfttype(id) {
    return web3.utils.hexToNumber("0x" + id.toHexString().substr(46, 4));
}

function is_subtoken(id) {
    return web3.utils.hexToNumber("0x" + id.toHexString().substr(58, 8)) > 0;
}

async function nft1155_env() {
    if (nft1155.use == true) {
        logger.info("not show nft1155 info");
    }
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let sdatas = {
        name: nft1155.name,
        contracturi: await cobj.uri(0),
        contractAddress: nft1155.address,
        mint_role: (await cobj.MINTER_ROLE()).toString(),
        token_count: (await cobj.tokenCount()).toString(),
    }
    show_msg(sdatas, "nft1155");
}


async function show_last_token(cobj) {
    let token_count = await cobj.tokenCount();
    logger.info("token count: " + token_count);
    if (token_count > 0) {
        let id  = await cobj.tokenId(token_count - 1);
        logger.info("latest id: " + id.toHexString());
    }
}

async function show_all_tokens() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let token_count = await cobj.tokenCount();
    for(let i = 0; i < token_count; i++) {
        let id  = await cobj.tokenId(i);
        let nfttype = await cobj.nftTypeName(get_nfttype(id));
        logger.info("nfttype name: " + nfttype + " id: " + id.toHexString());
    }
    logger.info("token count: " + token_count.toString());
}

async function show_parent_tokens() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let token_count = await cobj.tokenCount();
    let count = 0;
    for(let i = 0; i < token_count; i++) {
        let id  = await cobj.tokenId(i);
        let subtoken = is_subtoken(id);
        if (!subtoken) {
            let nfttype = await cobj.nftTypeName(get_nfttype(id));
            count += 1;
            logger.info("nfttype name: " + nfttype + " id: " + id.toHexString());
        }
    }
    logger.info("token count: " + count.toString() + "/" + token_count.toString());
}

async function show_nfttypes() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let token_count = await cobj.nftTypeCount();
    logger.info("token count: " + token_count.toString());
    for(let i = 1; i <= token_count; i++) {
        let nfttype = await cobj.nftTypeName(i);
        logger.info("nfttype name: " + nfttype + " id: " + i.toString());
    }
}

async function show_all_blind_tokens() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let token_count = await cobj.tokenCount();
    logger.info("token count: " + token_count -1);
    let count = 0;
    for(let i = 0; i < token_count; i++) {
        let id  = await cobj.tokenId(i);
        let nfttype = await cobj.isBlindBox(get_nfttype(id));
        if (nfttype) {
            logger.info("is subtoken: " + is_subtoken(id).toString() + " id : " + count.toString() + "-index("+ i.toString() + ") :" + id.toHexString());
            count = count + 1;
        }
    }
}

async function show_all_exchange_tokens() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let token_count = await cobj.tokenCount();
    logger.info("token count: " + token_count -1);
    let count = 0;
    for(let i = 0; i < token_count; i++) {
        let id  = await cobj.tokenId(i);
        let nfttype = await cobj.isExchange(get_nfttype(id));
        if (nfttype) {
            logger.info("is subtoken: " + is_subtoken(id).toString() + " id : " + count.toString() + "-index("+ i.toString() + ") :" + id.toHexString());
            count = count + 1;
        }
    }
}

async function exchange_all_blind_tokens() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let token_count = await cobj.tokenCount();
    logger.info("token count: " + token_count.toString());
    let count = 0;
    const accounts = await ethers.provider.listAccounts();
    let owner = accounts[0];
    for(let i = 0; i < token_count; i++) {
        let id  = await cobj.tokenId(i);
        let nfttype = await cobj.isBlindBox(get_nfttype(id));
        let subtoken = is_subtoken(id);
        if (nfttype && subtoken) {
            let balance = await cobj.balanceOf(owner, id);
            if(balance > 0) {
                logger.info("id : " + count.toString() + "-index("+ i.toString() + ") :" + id.toHexString());
                count = count + 1;
                await cobj.exchangeBlindBox(owner, id, []);
            }
        }
    }
}

async function nft1155_init() {
    if (nft1155.use == true) {
        logger.info("not show nft1155 info");
    }

    const accounts = await ethers.provider.listAccounts();
    let owner = accounts[0];
    logger.info("owner: " + accounts[0]);
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let brand_name = "qiyun"

    await show_last_token(cobj);
    let brand_idx = await cobj.brandId(brand_name);
    logger.info("mint before brand idx: " + brand_idx);
    let brand_id = 0;
    if (brand_idx == 0) {
        logger.info("minting... ");
        brand_id = await cobj.mintBrand(owner, brand_name, []);
        await show_last_token(cobj);
    } 
    brand_idx = await cobj.brandId(brand_name);
    logger.info("brand idx: " + brand_idx);

    //types init
    let type_names = ["mouse", "cattle"];
    let type_ids = {};

    for (let index in type_names) {
        name = type_names[index];
        let type_idx = await cobj.typeId(name);
        if (type_idx > 0) {
            logger.info("had type " + name);
            continue;
        }
        logger.info("type index: " + type_idx);

        logger.info("mint type " + name);
        let type_id = await cobj.mintType(owner, brand_name, name, []);
        await show_last_token(cobj);
        type_ids[name] = type_id;
    }

    logger.error("4");
    let quality_names = ["gold", "silver", "copper"];
    let nfttype_names = ["normal", "blind"];

    let quality_ids = {};
    for (let type_idx in type_names) {
        type_name = type_names[type_idx];
        for (let quality_idx in quality_names) {
            quality_name = quality_names[quality_idx];
            for (let nfttype_idx in nfttype_names) {
                nfttype_name = nfttype_names[nfttype_idx];
                let id = type_name + "_" + quality_name + "_" + nfttype_name;
                quality_id = await cobj.mintQuality(owner, brand_name, type_name, quality_name, nfttype_name, []);

                token_count = await cobj.tokenCount();
                quality_ids[id] = await cobj.tokenId(token_count - 1);
                await show_last_token(cobj);
            }
        }
    }


    let sub_ids = {}
    for (let type_idx in type_names) {
        type_name = type_names[type_idx];
        for (let quality_idx in quality_names) {
            quality_name = quality_names[quality_idx];
            for (let nfttype_idx in nfttype_names) {
                nfttype_name = nfttype_names[nfttype_idx];
                let id = type_name + "_" + quality_name + "_" + nfttype_name;
                sub_ids[id] = {};
                let amount = 50;
                if (nfttype_name == "blind") {
                    amount = 50;
                }
                let q_id = quality_ids[id];
                let sub_id = await cobj.mintSubToken(owner, q_id, amount, []);
                sub_ids[id]["start_id"] = q_id.toHexString();
                sub_ids[id]["amount"] = amount;
                await show_last_token(cobj);
            }
        }
    }

    let sdatas = {
        network:    await ethers.provider.getNetwork(),
        owner: owner,
        brand_id: brand_id,
        type_ids: type_ids,
        quality_ids: quality_ids,
        sub_ids: sub_ids
    }
    show_msg(sdatas, "datas");
}

async function set_blind_box_name() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let tran = await cobj.appendBlindBoxId("blind");
    logger.table(tran);
}

async function cancel_blind_box_name() {
    let cobj = await get_contract(nft1155.name, nft1155.address);
    let tran = await cobj.cancelBlindBoxId("blind");
    logger.table(tran);
}

async function run() {
    logger.debug("start working...", "init_main");
    let cobj = await get_contract(main.name, main.address);

    await nft1155_env();
    //await nft1155_init();
    await show_all_tokens();
    //await show_parent_tokens();
    //await set_blind_box_name();
    //await cancel_blind_box_name();
    //await show_all_blind_tokens();
    //await show_all_exchange_tokens();
    //await show_nfttypes();
    //await exchange_all_blind_tokens();
}

run()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
