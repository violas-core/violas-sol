// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IViolasMProofDatas{
    event TransferProof(address indexed from, address indexed to, string datas, address token, uint amount, uint fee, uint state);
    event TransferProofState(address indexed manager, uint version, uint state);
    
    function accountProofInfo(address sender, uint sequence) external view returns(string memory data, uint seq, uint state, address token, uint version, uint amount, uint fee); 
    function proofInfo(uint version) external view returns(string memory data, uint seq, uint state, address token, address sender, uint amount, bool create, uint fee); 
    
    function transferProof(address fromAddr, address toAddr,address token, uint amount, uint fee, string calldata datas) external payable returns (bool);
    function upUUState(uint version, uint state) external  returns (bool);
    function upUSState(uint version, string calldata state) external returns (bool);
    function upAUUState(address sender, uint sequence, uint state) external returns (bool);
    function upAUSState(address sender, uint sequence, string calldata state) external returns (bool);
    
    function accountIsExists(address account) external view returns(bool);
    function accountSequence(address account) external view returns(uint);
    function accountVersion(address account, uint sequence) external view returns(uint);
    function accountLatestVersion(address account) external view returns(uint);
    
    //use for update new logic
    function addressIndex(uint version) external view returns (uint sequence, address sender, bool create);
    function addressProof(address sender) external view returns (uint maxSequence, uint minVersion, uint maxVersion, bool inited);
    
    //proof state
    function upgradStateAddress(address stateAddr) external returns(bool);
    //proof main
    function upgradMainAddress(address mainAddr) external returns(bool);
}

