// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interface/ITokenFactory.sol";


/**
 * @title Token Factory
 * @dev Manage valid contract address and name of erc20 token to mapping violas chain
*/
contract TokenFactory is PausableUpgradeable, OwnableUpgradeable, ITokenFactory{
    using SafeMathUpgradeable for uint;
    uint public tokenMaxCount = 0;
    mapping(uint=>string) public validTokenNames;
    mapping(string=>address) tokens;
    mapping(address=>string) tokenNames;
    mapping(address=>uint) _tokenMinAmount;
    mapping(address=>uint) _tokenMaxAmount;
    
    modifier validAddress(address token){
        require(token != address(0), "token is invalid");
        _;
    }
    
    modifier validName(string memory name) {
        require(bytes(name).length > 0, "token address is invalid");
        _;
    }
    
    modifier validToken(address token) {
        require(bytes(tokenNames[token]).length > 0, "token address is invalid");
        _;
    }
  
    modifier validTokenName(string memory name) {
        address addr = tokens[name];
        require(addr != address(0), "token name is invalid");
        _;
    }
    
    function __TokenFactory_init() 
    internal
    initializer 
    {
        __Pausable_init();
        __Ownable_init();
    }

    function updateTokenMinAmount(address token, uint amount) 
    external 
    virtual
    onlyOwner
    validToken(token)
    override
    returns(bool)
    {
        _tokenMinAmount[token] = amount;
        return true;
      
    }
    
    function _validTokenAmount(address token, uint amount) 
    internal
    view
    returns(bool)
    {
        require(amount > 0 && 
        amount >= _tokenMinAmount[token] &&  
        (_tokenMaxAmount[token] == 0 || amount <= _tokenMaxAmount[token]) 
        , "token amount out of range");
        return true;
    }
    
    function updateTokenMaxAmount(address token, uint amount) 
    external 
    virtual
    onlyOwner
    validToken(token)
    override
    returns(bool)
    {
        _tokenMaxAmount[token] = amount;
        return true;
        
    }
    
    function tokenMinAmount(address token) 
    external 
    view 
    virtual
    override
    validToken(token)
    returns(uint)
    {
         return _tokenMinAmount[token];
    }
    
    function tokenMaxAmount(address token) 
    external 
    view 
    virtual
    override
    validToken(token)
    returns(uint)
    {
        return _tokenMaxAmount[token];
    }
    
    function tokenAddress(string calldata name) 
    external 
    view 
    virtual 
    override 
    returns(address tokenAddrr) 
    {
        tokenAddrr = tokens[name];
        require(tokenAddrr != address(0), "token name is invalid");
    }
    
    function tokenName(address tokenAddr) 
    external 
    view 
    virtual 
    override 
    returns(string memory name) 
    {
        name = tokenNames[tokenAddr];
        require(bytes(name).length > 0, "token address is invalid");
    }
    
    function _updateValidTokenNames(string memory name) 
    internal
    returns(bool)
    {
        uint saveIndex = tokenMaxCount;
        for(uint32 i = 0; i < tokenMaxCount; i++) {
            string storage findName = validTokenNames[i];
            if (keccak256(abi.encodePacked(findName)) == keccak256(abi.encodePacked(name))) {
                return true;
            }
            if (bytes(findName).length == 0 && saveIndex == tokenMaxCount) {
                saveIndex = i;
            }
        }
        
        validTokenNames[saveIndex] = name;
        if (saveIndex == tokenMaxCount) {
            tokenMaxCount++;
        }
        return true;
    }
    
    function _emptyValidTokenNames(string memory name) 
    internal
    returns(bool)
    {
        for(uint32 i = 0; i < tokenMaxCount; i++) {
            string storage findName = validTokenNames[i];
            if (keccak256(abi.encodePacked(findName)) == keccak256(abi.encodePacked(name))) {
                validTokenNames[i] = "";
            }
        }
        return true;
    }
    
    function updateToken(string calldata name, address tokenAddr) 
    external 
    payable 
    virtual 
    override 
    onlyOwner 
    validName(name) 
    validAddress(tokenAddr) 
    returns(bool)
    {
        address findAddr = tokens[name];
        if (findAddr != address(0)) {
            delete tokenNames[findAddr];
        }
        
        tokens[name] = tokenAddr;
        tokenNames[tokenAddr] = name;
        _updateValidTokenNames(name);
        return true;
    } 
    
    function _deleteToken(address tokenAddr)
    internal
    returns(bool)
    {
        string storage name = tokenNames[tokenAddr];
        delete tokenNames[tokenAddr];
        delete tokens[name];
        delete _tokenMinAmount[tokenAddr];
        delete _tokenMaxAmount[tokenAddr];
        return true;
    }
    
    function _deleteToken(string memory name)
    internal
    returns(bool)
    {
        address  _tokenAddr =  tokens[name];
        return _deleteToken(_tokenAddr);
    }
    
    function removeToken(string calldata name) 
    external 
    payable 
    virtual 
    override 
    onlyOwner 
    validTokenName(name) 
    returns(bool) 
    {
        _deleteToken(name);
        _emptyValidTokenNames(name);
        return true;
    }
    
    function removeToken(address tokenAddr) 
    external 
    payable 
    virtual 
    override 
    onlyOwner 
    validToken(tokenAddr) 
    returns(bool) 
    {
        string storage name = tokenNames[tokenAddr];
        _emptyValidTokenNames(name);
        _deleteToken(tokenAddr);
        return true;
    }
}

