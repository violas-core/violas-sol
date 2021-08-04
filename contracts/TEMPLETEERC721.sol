// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
pragma solidity ^0.8.0;

contract TEMPLETEERC721 is ERC721Upgradeable {
    function initialize() 
    initializer
    public
    {
        __ERC721_init("violas-tea001", "vt001");
    }

    function _baseURI() 
    internal 
    virtual
    override
    view 
    returns (string memory) 
    {
        return "tmd.violas.io";
    }
}
