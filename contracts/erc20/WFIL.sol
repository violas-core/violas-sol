/*
* https://etherscan.io/address/0x6e1A19F235bE7ED8E3369eF73b196C07257494DE#code
*->https://etherscan.io/address/0xd187c6c8c6aee0f021f92cb02887a21d529e26cb#code
*/
/**
 *Submitted for verification at Etherscan.io on 2020-05-11
*/

pragma solidity 0.5.16;

contract Proxy {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
    // constructor(bytes memory constructData, address contractLogic) public {
    constructor(address contractLogic) public {
        // save the code address
        assembly { // solium-disable-line
            sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, contractLogic)
        }
    }

    function() external payable {
        assembly { // solium-disable-line
            let contractLogic := sload(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7)
            let ptr := mload(0x40)
            calldatacopy(ptr, 0x0, calldatasize)
            let success := delegatecall(gas, contractLogic, ptr, calldatasize, 0, 0)
            let retSz := returndatasize
            returndatacopy(ptr, 0, retSz)
            switch success
            case 0 {
                revert(ptr, retSz)
            }
            default {
                return(ptr, retSz)
            }
        }
    }
}