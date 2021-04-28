// scripts/index.js
async function main() {
    // Our code will go here
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts);

    const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const Box = await ethers.getContractFactory("Box");
    const box = await Box.attach(address);
    await box.store(3);
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
