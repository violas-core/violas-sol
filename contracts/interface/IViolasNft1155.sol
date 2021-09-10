// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IViolasNft1155 {
    function tokenCount() external view returns(uint);
    function tokenTotleAmount(uint256 id) external view returns(uint256);
    function tokenId(uint256 index) external view returns(uint256);
    function tokenExists(uint256 id) external view returns(bool);

    function brandCount() external view returns(uint16);
    function brandName(uint32 id) external view returns(string memory);
    function brandId(string calldata name) external view returns(uint32);

    function typeCount() external view returns(uint16);
    function typeName(uint16 id) external view returns(string memory);
    function typeId(string calldata name) external view returns(uint16);

    function qualityCount() external view returns(uint16);
    function qualityName(uint16 id) external view returns(string memory);
    function qualityId(string calldata name) external view returns(uint16);

    function nftTypeCount() external view returns(uint16);
    function nftTypeName(uint16 id) external view returns(string memory);
    function nftTypeId(string calldata name) external view returns(uint16);

    function mintBrand(address to, string calldata brand, bytes calldata data) external payable returns(uint256);
    function mintType(address to, string calldata brand, string calldata btype, bytes calldata data) external payable returns(uint256);
    function mintQuality(address to, string calldata brand, string calldata btype, string calldata quality, string calldata nfttype, bytes calldata data) external payable returns(uint256);
    function mintSubToken(address to, uint256 qualityid, uint256 amount, bytes calldata data) external payable returns(uint256);
    function exchangeBlindBox(address to, uint256 id, bytes calldata data) external payable returns(uint256);
}
    //function setBlindBoxId(string calldata nfttype) external returns(uint16);
