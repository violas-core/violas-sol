// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IViolasMProofDatas{
    event TransferProof(address indexed from, address indexed to, string datas, address token, uint amount, uint fee, uint state);
    event TransferProofState(address indexed manager, uint version, uint state);
    
    function proofInfo(address sender, uint sequence) external view returns(string memory, uint, uint, address, uint, uint, uint);
    function proofInfo(uint version) external view returns(string memory, uint, uint, address, address, uint, bool, uint);
    
    function transferProof(address fromAddr, address toAddr,address token, uint amount, uint fee, string calldata datas) external payable returns (bool);
    function transferProofState(uint version, uint state) external  returns (bool);
    function transferProofState(uint version, string calldata state) external returns (bool);
    function transferProofState(address sender, uint sequence, uint state) external returns (bool);
    function transferProofState(address sender, uint sequence, string calldata state) external returns (bool);
    function transferContinuousComplete(uint verion) external returns (bool);
    
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

