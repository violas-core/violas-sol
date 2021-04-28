pragma solidity ^0.5.11;

contract HBTCTools {
    function getClassHash(string memory class) public view returns (bytes32){
        bytes32 classHash = keccak256(abi.encodePacked(class));
        return classHash;
    }
}
