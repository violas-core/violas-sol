// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ITokenFactory.sol";

interface IViolasMProofMain is ITokenFactory{
    event TransferProof(address indexed from, address indexed to, address token, uint amount, uint fee);
    
    function transferProof(address token, string calldata datas) external payable returns (bool);
    function transfer(address tokenAddrr, address recipient, uint amount) external payable returns (bool);
    function upgradProofDatasAddress(address proofAddr) external returns(bool);
    function transferPayeeship(address newPayee) external returns(address);
}

