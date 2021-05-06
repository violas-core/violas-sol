// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./interface/IViolasMProofDatas.sol";
import "./interface/IViolasMProofMain.sol";
import "./TokenFactory.sol";

contract ViolasMProofMain is TokenFactory, IViolasMProofMain{
    using SafeMathUpgradeable for uint;
    
    uint public contractVersion;
    
    //base info
    string public name;
    string public symbol;
    bool public deprecated;
    address public payee;
    address public proofAddress;

    function initialize() 
    initializer 
    public 
    {
        __TokenFactory_init();
        name        = "Violas Proof Main";
        symbol      = "VPM";
        payee       = msg.sender;
    }

    modifier canProof(){
        require(msg.sender != payee, "The payment account and receiving account are same.");
        _;
    }

    function transferPayeeship(address newPayee) 
    external
    onlyOwner 
    virtual
    override
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
