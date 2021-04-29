// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ITokenFactory{
    function tokenMinAmount(address token) external view returns(uint);
    function tokenMaxAmount(address token) external view returns(uint);
    function updateTokenMinAmount(address token, uint amount) external returns(bool);
    function updateTokenMaxAmount(address token, uint amount) external returns(bool);
    function tokenAddress(string calldata name) external view returns(address);
    function tokenName(address token) external view returns(string memory);
    function updateToken(string calldata name, address token) external payable returns(bool);
    function removeToken(string calldata name) external payable returns(bool);
    function removeToken(address name) external payable returns(bool);
}

