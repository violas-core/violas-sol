// scripts/index.js
async function main() {
    // Our code will go here
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts);

    //const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    //const address = "0x222493c8827eF8a01F04b8Fa733EC8ec6440BA84" //kovan
    //const address = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" //upgrades local
    const address = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    const Box = await ethers.getContractFactory("BoxV2");
    const box = await Box.attach(address);
    await box.increment();
    value = await box.retrieve();
    console.log("Box value is", value.toString());
}

async function deploy() {
    //npx hardhat run --network localhost scripts/deploy.js
    const Box = await ethers.getContractFactory("Box");
    console.log("Deploying Box...");
    const box = await Box.deploy();
    await box.deployed();
    console.log("Box deployed to:", box.address);
    return box.address
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
