// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
pragma solidity ^0.8.0;

contract ViolasNft1155 is ERC1155Upgradeable {
    function initialize() 
    initializer
    public
    {
        __ERC1155_init("tmd.violas.io");
    }
}
