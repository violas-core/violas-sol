// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC1155/presets/ERC1155PresetMinterPauserUpgradeable.sol";
import "./interface/IViolasNft1155.sol";

pragma solidity ^0.8.0;

contract ViolasNft1155 is ERC1155PresetMinterPauserUpgradeable{

    //index(0~n)
    uint256 private _token_index;

    //index => token_id
    mapping(uint256 => uint256) private _tokens;

    //token's totle amount
    mapping(uint256 => uint256) private _totle_amount;

    //token is exists 
    mapping(uint256 => bool) private _token_exists;

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal
        virtual
        override(ERC1155PresetMinterPauserUpgradeable)
    { 
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        //mint
        if (from == address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 id = ids[i];
                if (!_token_exists[id]) {
                    _tokens[_token_index] = id;
                    _token_exists[id] = true;
                    _token_index = _token_index + 1;
                }
                _totle_amount[id] += amounts[i];
            }
        } if (from != address(0) && to == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 id = ids[i];
                if (!_token_exists[id]) {
                    _totle_amount[id] += amounts[i];
                }
            }
        }
    }

    function tokenCount() 
    public 
    view 
    virtual 
    returns(uint256) 
    {
        return _token_index;
    }

    function tokenTotleAmount(uint256 id) 
    public 
    view 
    virtual 
    returns(uint256) 
    {
        return _totle_amount[id];
    }

    function tokenId(uint256 index) 
    public 
    view 
    virtual 
    returns(uint256) 
    {
        return _tokens[index];
    }

    function tokenExists(uint256 id) 
    public 
    view 
    virtual 
    returns(bool) 
    {
        return _token_exists[id];
    }


    uint256[50] private __gap;
}
