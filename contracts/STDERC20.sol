// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
pragma solidity ^0.8.0;

contract STDERC20 is ERC20 {
    constructor (string memory name_, string memory symbol_) ERC20(name_, symbol_) {}
}

