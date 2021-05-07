// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./interface/IViolasMProofState.sol";

/**
 * @title Mapping State Manage
 * @dev 
*/
contract ViolasMProofState is OwnableUpgradeable, IViolasMProofState{
    using SafeMathUpgradeable for uint;
    mapping(uint=>string) states;
    mapping(string=>uint) statesswap;
    uint public maxStateValue;
    string public name;
    string public symbol;

    function initialize() 
    initializer 
    public 
    {
        __Ownable_init();

        name = "Violas Proof State";
        symbol = "VPS";

        maxStateValue = 1;
        states[maxStateValue++] = "start";  //1
        states[maxStateValue++] = "stop";   //3
        states[maxStateValue++] = "end";    //4
        for(uint i = 0; i < maxStateValue; i++) {
            statesswap[states[i]] = i;
        }
    }
    
    function getStateName(uint stateValue) 
    external
    override 
    virtual
    view
    returns(string memory)
    {
        return states[stateValue];
    }
    
    function getStateValue(string calldata stateName) 
    external 
    override 
    virtual
    view
    returns(uint)
    {
        return statesswap[stateName];
    }
    
    function checkStateChange(uint fromState, uint toState) 
    external
    override 
    virtual
    view
    returns(bool)
    { 
        return _checkStateChangePath(fromState, toState);
    }
    
    function checkStateChange(string calldata fromState, string calldata toState) 
    external 
    override 
    virtual 
    view
    returns(bool)
    {
        return _checkStateChangePath(statesswap[fromState], statesswap[toState]);
    }
    
    function checkState(string calldata stateName) 
    external 
    override 
    virtual 
    view
    returns (bool)
    {
        return statesswap[stateName] > 0;
    }
    
    function checkState(uint stateValue) 
    external
    override 
    virtual
    view
    returns (bool)
    {
        return stateValue > 0 && stateValue < maxStateValue;
    }
    
    function _checkStateChangePath(uint fromState, uint toState) 
    internal 
    view
    returns(bool) {
        require(fromState < toState && fromState >= 1 && toState < maxStateValue, "input state value is invalid");
        if (fromState == statesswap["start"] && 
                (toState == statesswap["stop"] || toState == statesswap["end"]) ) {
            return true;
         }
         return false;
    }
    
}
