// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  console.log("Upgrading Box...");
  const box = await upgrades.upgradeProxy("0xe2C49254b077FD86c9785b6E46F996E27941A301", BoxV2);
  console.log("Box upgraded");
}

main();
