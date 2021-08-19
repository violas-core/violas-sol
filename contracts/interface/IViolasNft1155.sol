// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IViolasNft1155 {
    function tokenCount() external view returns(uint);
    function tokenTotleAmount(uint256 id) external view returns(uint256);
    function tokenId(uint256 index) external view returns(uint256);
    function tokenExists(uint256 id) external view returns(bool);
    
}
