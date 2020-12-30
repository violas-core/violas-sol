   /**
 *Submitted for verification at Etherscan.io on 2020-10-13
*/

pragma solidity =0.6.6;

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}

/**
 * @title Violas mapping proof datas
 * 
 */
interface IViolasMProofDatas{
    event TransferProof(address indexed from, address indexed to, string datas, address token, uint amount, uint state);
    event TransferProofState(address indexed manager, uint version, uint state);
    
    function proofInfo(address sender, uint sequence) external view returns(string memory, uint, uint, address, uint, uint);
    function proofInfo(uint version) external view returns(string memory, uint, uint, address, address, uint, bool);
    
    function transferProof(address fromAddr, address toAddr,address token, uint amount, string calldata datas) external payable returns (bool);
    function transferProofState(uint version, uint state) external payable returns (bool);
    function transferProofState(uint version, string calldata state) external payable returns (bool);
    function transferProofState(address sender, uint sequence, uint state) external payable returns (bool);
    function transferProofState(address sender, uint sequence, string calldata state) external payable returns (bool);
    
    //proof state
    function upgradStateAddress(address stateAddr) external returns(bool);
    //proof main
    function upgradMainAddress(address mainAddr) external returns(bool);
}

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
    event TransferProof(address indexed from, address indexed to, address token, uint amount);
    
    function transferProof(address token, string calldata datas) external payable returns (bool);
    function transfer(address tokenAddrr, address recipient, uint amount) external payable returns (bool);
    function upgradProofDatasAddress(address proofAddr) external returns(bool);
}
 
/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract  Ownable{
    address public owner;

    /**
      * @dev The Ownable constructor sets the original `owner` of the contract to the sender
      * account.
      */
    constructor() public {
        owner = msg.sender;
    }

    /**
      * @dev Throws if called by any account other than the owner.
      */
    modifier onlyOwner() {
        require(msg.sender == owner, "Owner role required");
        _;
    }

    /**
      * @dev Throws if called by any account other than the owner.
      */
    modifier notOwner() {
        require(msg.sender != owner, "Other role required, not Owner");
        _;
    }
    
    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

}

contract Payeeable is Ownable{
    address public payee;

    /**
      * @dev The Ownable constructor sets the original `owner` of the contract to the sender
      * account.
      */
    constructor() public {
        payee = msg.sender;
    }

    function transferPayeeship(address newPayee) public onlyOwner {
        if (newPayee != address(0)) {
            payee = newPayee;
        }
    }

}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Payeeable {
  event Pause();
  event Unpause();

  bool public paused = false;

  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused, "paused is true");
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused, "paused is false");
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused public {
    paused = true;
    emit Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused public {
    paused = false;
    emit Unpause();
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
    
    address public proofAddress;
    constructor(string memory _name, string memory _symbol) public {
        name        = _name;
        symbol      = _symbol;
        //stateManage = new ProofStateMng("root state manage", "root");
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
    virtual 
    override
    payable 
    returns(bool) 
    {
        IERC20 erc20 = IERC20(tokenAddr);
        uint allowance_amount = erc20.allowance(msg.sender, address(this));
        
        uint before_amount = erc20.balanceOf(payee);
        TransferHelper.safeTransferFrom(tokenAddr, msg.sender, payee, allowance_amount);
        uint after_amount = erc20.balanceOf(payee);
        uint diff_amount = after_amount - before_amount;
        
        _validTokenAmount(tokenAddr, allowance_amount);
        
        require(
            IViolasMProofDatas(proofAddress).transferProof(msg.sender, payee, tokenAddr, diff_amount, datas),
            "update proof to datas failed"
            );
        
        emit TransferProof(msg.sender, payee, tokenAddr, diff_amount);
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
