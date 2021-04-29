// SPDX-License-Identifier: MIT

/**
 *Submitted for verification at Etherscan.io on 2020-10-13
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./interface/IViolasMProofDatas.sol";

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

interface IViolasMProofMain is ITokenFactory{
    event TransferProof(address indexed from, address indexed to, address token, uint amount, uint fee);
    
    function transferProof(address token, string calldata datas) external payable returns (bool);
    function transfer(address tokenAddrr, address recipient, uint amount) external payable returns (bool);
    function upgradProofDatasAddress(address proofAddr) external returns(bool);
    function transferPayeeship(address newPayee) external returns(address);
}

}

/**
 * @title Token Factory
 * @dev Manage valid contract address and name of erc20 token to mapping violas chain
*/
contract TokenFactory is Pausable, ITokenFactory{
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
    
    constructor() public {
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

contract ViolasMProofMain is TokenFactory, IViolasMProofMain{
    using SafeMath for uint;
    
    uint public contractVersion = 1;
    
    //base info
    string public name;
    string public symbol;
    bool public deprecated;
    address public payee;
    address public proofAddress;
    constructor(string memory _name, string memory _symbol) public {
        name        = _name;
        symbol      = _symbol;
        payee = msg.sender;
        //stateManage = new ProofStateMng("root state manage", "root");
    }

    modifier canProof(){
        require(msg.sender != payee, "The payment account and receiving account are same.");
        _;
    }

    function transferPayeeship(address newPayee) 
    public 
    onlyOwner 
    virtual
    override
    payable 
    returns (address)
    {

        require(newPayee != address(0), "address is 0x0");
        require(newPayee != payee, "the same address.");
        address oldPayee = payee;
        payee = newPayee;
        return oldPayee;
    }

    function transfer(address tokenAddrr, address recipient, uint amount) 
    external 
    onlyOwner
    whenNotPaused
    virtual
    override
    payable 
    returns (bool)
    {
        TransferHelper.safeTransfer(tokenAddrr, recipient, amount);
        return true;
    }
    
    /**
     * @dev transfer ERC20 token to payee, and storage proof info
     * 
     * @param tokenAddr ERC20 token address
     * @param datas proof datas
     */
    function transferProof(address tokenAddr, string calldata datas) 
    external
    whenNotPaused
    validToken(tokenAddr)
    canProof
    virtual 
    override
    payable 
    returns(bool) 
    {
        IERC20Upgradeable erc20 = IERC20Upgradeable(tokenAddr);
        uint allowance_amount = erc20.allowance(msg.sender, address(this));
        _validTokenAmount(tokenAddr, allowance_amount);

        uint before_amount = erc20.balanceOf(payee);

        TransferHelper.safeTransferFrom(tokenAddr, msg.sender, payee, allowance_amount);

        uint after_amount = erc20.balanceOf(payee);
        uint payment_amount = after_amount.sub(before_amount);

        require(payment_amount <= allowance_amount && payment_amount > 0, "diff amount value is incorrect");

        uint fee_amount = allowance_amount.sub(payment_amount);
        string memory save_datas = datas;
        
        require(
            IViolasMProofDatas(proofAddress).transferProof(msg.sender, payee, tokenAddr, payment_amount, fee_amount, save_datas),
            "update proof to datas failed"
            );
        
        emit TransferProof(msg.sender, payee, tokenAddr, payment_amount, fee_amount);
        return true;
    }
    
    /**
     * @dev upgrad proof datas contract address 
     * @param proofAddr contract address
     */
    function upgradProofDatasAddress(address proofAddr) 
    external
    onlyOwner
    virtual 
    override
    returns(bool) {
        
        if (proofAddress != proofAddr) {
            contractVersion += 1;
            proofAddress = proofAddr;
        }
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

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library TransferHelper {
     function safeApprove(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: APPROVE_FAILED');
    }

    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FROM_FAILED');
    }
}
