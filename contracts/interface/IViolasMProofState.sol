// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IViolasMProofState{
    function getStateName(uint stateValue) external view returns(string memory);
    function getStateValue(string calldata stateName) external view returns(uint);
    function checkStateChange(uint fromState, uint toState) external view returns(bool);
    function checkStateChange(string calldata fromState, string calldata toState) external view returns(bool);
    function checkState(string calldata stateName) external view returns (bool);
    function checkState(uint stateValue) external view returns (bool);
}
