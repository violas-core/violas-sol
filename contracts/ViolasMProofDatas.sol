// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./interface/IProofStateMng.sol";
import "./interface/IViolasMProofDatas.sol";

/**
 * @title Mngable
 * @dev The Mngable contract has an managers address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Mngable is OwnableUpgradeable{
    mapping(address=>bool) managers;
    mapping(uint=>address) public manager;
    uint public managerMaxCount = 0;

    /**
      * @dev The Ownable constructor sets the original `owner` of the contract to the sender
      * account.
      */
    function __Mngable_init() internal initializer {
        __Ownable_init();
        __Mngable_init_unchained();
    }

    function __Mngable_init_unchained() internal initializer {
        managers[msg.sender] = true;
        manager[0] = msg.sender;
        managerMaxCount++;
    }

    /**
      * @dev Throws if called by any account other than the owner.
      */
    modifier onlyManager() {
        require((managers[msg.sender] || (msg.sender == owner())), "only manager or owner role required");
        _;
    }

    /**
     * @dev requst address is manage
     * @param managerAddr manager address
     */
    function manageRoleState(address managerAddr) public view returns(bool) {
        return managers[managerAddr];
    }
    
    /**
    * @dev Allows the current owner to grant manage role for account.
    * @param newManager .
    */
    function grantedMngPermission(address newManager) public onlyOwner {
        require(newManager != address(0), "address(0x0) is invalid");
        managers[newManager] = true;
        _updateVaildManager(newManager);
    }
    
    /**
    * @dev Allows the current owner to revoke manage role for account.
    * @param managerAddr manager address
    */
    function revokeMngPermission(address managerAddr) public onlyOwner {
        require(managerAddr != address(0), "address(0x0) is invalid");
        require(managerAddr != owner(), "can not revoke self permission");
        
        managers[managerAddr] = false;
        _emptyValidManager(managerAddr);
    }
    
    function _updateVaildManager(address managerAddr) 
    internal
    returns(bool)
    {
        uint saveIndex = managerMaxCount;
        for(uint32 i = 0; i < managerMaxCount; i++) {
            address findAddr = manager[i];
            if (findAddr == managerAddr) {
                return true;
            }
            //get first empty index
            if (findAddr == address(0) && saveIndex == managerMaxCount) {
                saveIndex = i;
            }
        }
        
        manager[saveIndex] = managerAddr;
        if (saveIndex == managerMaxCount) {
            managerMaxCount++;
        }
        return true;
    }
    
    function _emptyValidManager(address managerAddr) 
    internal
    returns(bool)
    {
        for(uint32 i = 0; i < managerMaxCount; i++) {
            address findAddr = manager[i];
            if (findAddr == managerAddr) {
                manager[i] = address(0);
            }
        }
        return true;
    }
}


contract ViolasMProofDatas is Mngable,IViolasMProofDatas{
    using SafeMathUpgradeable for uint;
    
    struct ProofData {
        uint        amount;
        uint        fee;
        uint        version;
        uint        sequence;
        uint        state;
        address     token;
        string      data;
    }
    
    struct AddressProof{
        uint maxSequence;
        uint minVersion;
        uint maxVersion;
        address account;
        bool    inited;
        mapping(uint=>ProofData) proofDatas;
    }
    
    struct AddressIndex{
        uint    sequence;
        address sender;
        bool    create;
    }
    
    //base info
    string public name;
    string public symbol;
    
    //proof info
    uint public nextVersion;
    uint public continuousComplete;
    mapping(address=>AddressProof) proofs;
    mapping(uint=>AddressIndex) proofIndexs;

    //proof state contract upgraded
    address public stateAddress;
    IProofStateMng  stateManage;
    
    //main contract 
    address public mainAddress;
    /**
      * @dev Throws if called by any account other than the owner or mainer.
      */
    modifier onlyMainer() {
        require((mainAddress == msg.sender || (msg.sender == owner())), "only mainer or owner role required");
        _;
    }
    
    function initialize(string memory _name, string memory _symbol) initializer public {
        __Mngable_init();
        name        = _name;
        symbol      = _symbol;
        nextVersion = 0;
        continuousComplete = 0;
    }
    
    function addressProof(address sender)
    external
    virtual
    override
    view
    returns (uint maxSequence, uint minVersion, uint maxVersion, bool inited)
    {
        AddressProof storage ap = proofs[sender];
        maxSequence = ap.maxSequence;
        minVersion  = ap.minVersion;
        maxVersion  = ap.maxVersion;
        inited      = ap.inited;
    }
    
    function addressIndex(uint version)
    external
    virtual
    override
    view
    returns (uint sequence, address sender, bool create) 
    {
        require(version < nextVersion, "arguments is invalid");
        
        AddressIndex storage ai = proofIndexs[version];
        sequence = ai.sequence;
        sender = ai.sender;
        create = ai.create;
    }

    function accountIsExists(address account) 
    external 
    virtual
    override
    view 
    returns(bool)
    {
        return proofs[account].inited;
    }

    function accountSequence(address account) 
    external 
    virtual
    override
    view 
    returns(uint)
    {
        require(proofs[account].inited, "account not found");
        return proofs[account].maxSequence - 1;
    }
    function accountVersion(address account, uint sequence) 
    external 
    virtual
    override
    view 
    returns(uint)
    {
        require(proofs[account].inited, "account not found");
        require(sequence < proofs[account].maxSequence, "sequence is too big");
        return proofs[account].proofDatas[sequence].version;
    }
    
    function accountLatestVersion(address account) 
    external
    virtual
    override
    view 
    returns(uint)
    {
        require(proofs[account].inited, "account not found");
        return proofs[account].maxVersion;
    }
    
    function _getSenderAndSequence(uint version) 
    internal
    view
    returns(address sender, uint sequence, bool create) 
    {
        require(version < nextVersion, "version is invalid");
        sequence = proofIndexs[version].sequence;
        sender = proofIndexs[version].sender;
        create = proofIndexs[version].create;
        require(proofs[sender].inited, "proof is invalid");
    }
    
    function _getProofWithAddr(address sender, uint sequence)
    internal
    view
    returns(ProofData storage pd) {
        AddressProof storage addrProof = proofs[sender];
        pd = addrProof.proofDatas[sequence];
        require(sequence <= addrProof.maxSequence && addrProof.inited && pd.token != address(0), "sequence is invalid");
    }
    
    function _getProofWithVersion(uint version)
    internal
    view
    returns(ProofData storage pd, address sender, bool create) 
    {
        (address addr, uint sequence, bool state) = _getSenderAndSequence(version);
        sender = addr;
        create = state;
        pd = _getProofWithAddr(sender, sequence);
    }
    
    function proofInfo(address sender, uint sequence) 
    public 
    virtual
    override
    view 
    returns(string memory, uint, uint, address, uint, uint, uint) 
    {
        ProofData storage pd = _getProofWithAddr(sender, sequence);
        return (pd.data, pd.sequence, uint(pd.state), pd.token, pd.version, pd.amount, pd.fee);
    }
    
    function proofInfo(uint version) 
    public 
    view
    virtual
    override
    returns(string memory, uint, uint, address, address, uint, bool, uint) 
    {
        (ProofData storage pd, address sender, bool create) = _getProofWithVersion(version);
        return (pd.data, pd.sequence, uint(pd.state), pd.token, sender, pd.amount, create, pd.fee);
    }
    
    function _saveProof(address fromAddr, address tokenAddr, string memory data, uint state, uint amount, uint fee)
    internal
    returns(bool)
    {
        AddressProof storage ap = proofs[fromAddr];
        if (ap.inited) {
            ap.maxVersion = nextVersion;
        } else {
            ap.account      = fromAddr;
            ap.maxSequence  = 0; 
            ap.minVersion   = nextVersion; 
            ap.maxVersion   = nextVersion;
            ap.inited       = true;
        }
        ap.proofDatas[ap.maxSequence] = ProofData({version: nextVersion, sequence: ap.maxSequence, data:data, state:state, token:tokenAddr, amount:amount, fee:fee});
        
        //update index
        proofIndexs[nextVersion] = AddressIndex({sender:fromAddr, create: true, sequence: ap.maxSequence});
        
        //final treatment
        nextVersion = nextVersion.add(1);
        ap.maxSequence = ap.maxSequence.add(1);
        
        return true;
    }
    
    function transferProof(address fromAddr, address toAddr, address token, uint amount, uint fee, string calldata datas) 
    external
    onlyMainer
    virtual 
    override
    payable
    returns(bool) 
    {
        uint state = stateManage.getStateValue("start");
        bool ret_state = _saveProof(fromAddr, token, datas, state, amount, fee);
        require(ret_state, "save proof data failed.");
        
        emit TransferProof(fromAddr, toAddr, datas, token, amount, fee, state);
        return true;
    }
    
    function transferContinuousComplete(uint verion)
    external
    virtual
    override
    returns(bool)
    {
        continuousComplete = verion;
        return true;
    }
    
    
    function _checkStateChange(uint fromState, uint toState)
    internal
    view
    returns(bool)
    {
        bool isValid = stateManage.checkStateChange(fromState, toState);
        require(isValid, "state change path is invalid");
        return true;
    }
    
    function _updatProof(ProofData storage proofData, address sender, uint state) 
    internal
    returns(bool) {
        require(sender != address(0));
        proofIndexs[nextVersion] = AddressIndex({sender:sender, create: false, sequence: proofData.sequence});
        
        _checkStateChange(proofData.state, state);
        proofData.state = state;
        
        nextVersion = nextVersion.add(1);
        emit TransferProofState(msg.sender, proofData.version, state);
        
        return true;
    }
    
    function transferProofState(uint version, uint state) 
    external
    onlyManager
    override 
    virtual 
    returns(bool) 
    {
        (ProofData storage pd, address sender, bool create) = _getProofWithVersion(version);
        create = true;
        return _updatProof(pd, sender, state);
    }
    
    function transferProofState(uint version, string calldata state) 
    external
    onlyManager
    override 
    virtual 
    returns(bool) 
    {
        (ProofData storage pd, address sender, bool create) = _getProofWithVersion(version);
        create = true;
        uint stateValue = stateManage.getStateValue(state);
        
        return _updatProof(pd, sender, stateValue);
    }
    
    function transferProofState(address sender, uint sequence, uint state) 
    external
    onlyManager
    override 
    virtual 
    returns(bool) 
    {
        ProofData storage pd = _getProofWithAddr(sender, sequence);
        
        return _updatProof(pd, sender, state);
    }
    
    
    function transferProofState(address sender, uint sequence, string calldata state) 
    external
    onlyManager
    override 
    virtual 
    returns(bool) 
    {
        ProofData storage pd = _getProofWithAddr(sender, sequence);
        uint stateValue = stateManage.getStateValue(state);
        
        return _updatProof(pd, sender, stateValue);
    }
    
    function upgradStateAddress(address stateAddr) 
    external
    virtual
    onlyOwner
    override
    returns(bool) {
        require(stateAddr != address(0), "mainAddr is invalid.");
        stateAddress = stateAddr;
        stateManage = IProofStateMng(stateAddress);
        return true;
    }
    
    function upgradMainAddress(address mainAddr) 
    external
    virtual
    onlyOwner
    override
    returns(bool) {
        require(mainAddr != address(0), "mainAddr is invalid.");
        mainAddress = mainAddr;
        return true;
    }
    
    
    /*
     * @title receive eth for this  
     * @dev must be
    */
    receive()  
    external 
    payable
    {
    }
}
