// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC1155/presets/ERC1155PresetMinterPauserUpgradeable.sol";
import "./interface/IViolasNft1155.sol";

pragma solidity ^0.8.0;

contract ViolasNft1155 is ERC1155PresetMinterPauserUpgradeable{

    //index(0~n)
    uint256 private _token_index;

    //index => token_id
    mapping(uint256 => uint256) private _tokens;

    //token's totle amount
    mapping(uint256 => uint256) private _totle_amount;

    //token is exist 
    mapping(uint256 => bool) private _token_exists;

    //nft mark
    uint64 private _nft_mark;

    //nft version
    uint32 private _nft_version;

    //pre
    uint16   private _nft_reserve;

    //brand
    uint32   private _brand_pos;
    mapping(uint32 => string) private _brand_ids;
    mapping(string => uint32) private _brand_names;

    //type
    uint16   private _type_pos;
    mapping(uint16 => string) private _type_ids;
    mapping(string => uint16) private _type_names;

    //quality == level
    uint16   private _quality_pos;
    mapping(uint16 => string) private _quality_ids;
    mapping(string => uint16) private _quality_names;

    //nft type
    uint16   private _nfttype_pos;
    mapping(uint16 => string) private _nfttype_ids;
    mapping(string => uint16) private _nfttype_names;
    mapping(uint16 => bool)   private _blind_box_ids;

    //token_id(quality) index
    mapping(uint256 => uint32) private _quality_index;

    //token_id sub index
    mapping(uint256 => uint32) private _subtoken_index;

    //unique ids
    mapping(uint256 => bool)   private _unique_ids;

    string constant private _NORMAL_TYPE = "normal";
    string constant private _EXCHANGE_TYPE = "exchange";

    //make sure quality is had when mint sub token
    mapping(uint256 => bool)   private _quality_ids_had;

    struct IdFields {
        uint64 mark; 
        uint32 version; 
        uint16 reserve;
        uint32 brand;
        uint16 btype;
        uint16 quality;
        uint16 nfttype;
        uint32 quality_index;
        uint32 subtoken_index;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal
        virtual
        override(ERC1155PresetMinterPauserUpgradeable)
    { 
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        //mint
        if (from == address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 id = ids[i];

                if (!_token_exists[id]) {
                    _tokens[_token_index] = id;
                    _token_exists[id] = true;
                    _token_index = _token_index + 1;
                }
                _totle_amount[id] += amounts[i];
            }
        //burn : total amount - amount
        } else if (from != address(0) && to == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 id = ids[i];
                if (_token_exists[id]) {
                    _totle_amount[id] -= amounts[i];
                }
            }
        }
    }

    function tokenCount() 
    public 
    view 
    virtual 
    returns(uint256) 
    {
        return _token_index;
    }

    function tokenTotleAmount(
        uint256 id
    ) 
    public 
    view 
    virtual 
    returns(uint256) 
    {
        return _totle_amount[id];
    }

    function tokenId(
        uint256 index
    ) 
    public 
    view 
    virtual 
    returns(uint256) 
    {
        return _tokens[index];
    }

    function tokenExists(
        uint256 id 
    ) 
    public 
    view 
    virtual 
    returns(bool) 
    {
        return _token_exists[id];
    }

    function brandCount(
    ) 
    public
    view 
    returns(uint32) 
    {
        return _brand_pos;
    }

    function brandName(
        uint32 id
    ) 
    external 
    view 
    returns(string memory) 
    {
        return _brand_ids[id];
    }

    function brandId(
        string calldata name
    ) 
    external 
    view 
    returns(uint32)
    {
        return _brand_names[name];
    }

    function typeCount(
    ) 
    external 
    view 
    returns(uint16)
    {
        return _type_pos;
    }

    function typeName(
        uint16 id
    ) 
    external 
    view 
    returns(string memory)
    {
        return _type_ids[id];
    }

    function typeId(
        string calldata name
    ) 
    external 
    view 
    returns(uint16)
    {
        return _type_names[name];
    }

    function qualityCount(
    ) 
    external 
    view 
    returns(uint16)
    {
        return _quality_pos;
    }

    function qualityName(
        uint16 id
    ) 
    external 
    view 
    returns(string memory)
    {
        return _quality_ids[id];
    }

    function qualityId(
        string calldata name
    ) 
    external 
    view 
    returns(uint16) {
        return _quality_names[name];
    }

    function nftTypeCount()
    public
    view
    virtual
    returns(uint16) {
        return _nfttype_pos;
    }

    function nftTypeName(
        uint16 id
    )
    public
    view
    virtual
    returns(string memory) 
    {
        return _nfttype_ids[id];
    }

    function nftTypeId(
        string memory name
    )
    internal
    view
    virtual
    returns(uint16) {
        return _nfttype_names[name];
    }

    function isBlindBox(
        uint16 nfttype
    ) 
    external 
    view returns(bool)
    {
        return _blind_box_ids[nfttype];
    }

    function isExchange(
        uint16 nfttype
    ) 
    external 
    view returns(bool)
    {
        return nfttype == _nfttype_names[_EXCHANGE_TYPE];
    }

    function mintBrand(
        address to, 
        string calldata brand, 
        bytes calldata data
    ) 
    external 
    payable 
    virtual
    returns(uint256)
    {
        uint32 brand_id = _newBrand(brand);
        uint256 id = _createId(brand_id, 0, 0, 0, 0, 0);

        require(_unique_ids[id] == false, "brand id is exists");
        _unique_ids[id] = true;

        super.mint(to, id, 1, data);

        return id;
    }

    function mintType(
        address to, 
        string calldata brand, 
        string calldata btype, 
        bytes calldata data
    ) 
    external 
    payable 
    virtual
    returns(uint256)
    {
        uint32 brand_id = _brand_names[brand];
        require(brand_id > 0, "brand is not exist, mint brand first.");

        uint16 type_id = _newType(btype);
        require(type_id  > 0, "type id is 0");
        uint256 id = _createId(brand_id, type_id, 0, 0, 0, 0);

        require(_unique_ids[id] == false, "type id is exist");
        _unique_ids[id] = true;

        super.mint(to, id, 1, data);
        return id;
    }

    function mintQuality(
        address to, 
        string calldata brand, 
        string calldata btype, 
        string calldata quality, 
        string calldata nfttype, 
        bytes calldata data
    ) 
    external 
    payable 
    virtual
    returns(uint256)
    {
        require(_brand_names[brand] > 0, "brand is not exist, mint brand first.");
        require(_type_names[btype]> 0, "type is not exist, mint type first.");

        uint256 id = _createId(_brand_names[brand], _type_names[btype], _newQuality(quality) , _newNftType(nfttype), 0, 0);
        id = _createId(_brand_names[brand], _type_names[btype], _newQuality(quality) , _newNftType(nfttype), _qualityIndex(id), 0);

        _unique_ids[id] = true;

        //only qualityid is true, mintSubToken can work
        _quality_ids_had[id] = true;

        super.mint(to, id, 1, data);
        return id;
    }

    function mintSubToken(
        address to, 
        uint256 qualityid, //with nfttype
        uint256 amount, 
        bytes calldata data
    ) 
    external 
    payable 
    virtual
    returns(uint256)
    {
        require(_unique_ids[qualityid] == true, "quality id is not exist");

        //check qualityid is invalid !!!!!!!
        require(_quality_ids_had[qualityid] == true, "quality id is not exist");

        uint256 start_id = 0;
        for(uint256 i = 0; i < amount; i++) {
            uint256 id = qualityid + _subtokenIndex(qualityid);
            if (start_id == 0) {
                start_id = id;
            }
            super.mint(to, id, 1, data);
        }

        return start_id;
    }
    
    function exchangeBlindBox(
        address to, 
        uint256 id, //with nfttype
        bytes calldata data
    ) 
    external 
    payable 
    virtual
    returns(uint256)
    {
        IdFields memory ifs = _splitId(id);
        address operator = _msgSender();
        
        uint256 quality_id = _createId(ifs.brand, ifs.btype, ifs.quality, ifs.nfttype, ifs.quality_index, 0);

        require(ifs.subtoken_index > 0, "must subtoken can exchange");
        require(_unique_ids[quality_id] == true, "id is not exist");
        require(_blind_box_ids[ifs.nfttype] == true, "id is not blind box type");
        require(balanceOf(operator, id) == 1, "amount is not 1. ");

        super.burn(operator, id, 1);

        quality_id = _createId(ifs.brand, _selectType(quality_id), _selectQuality(id), _newNftType(_EXCHANGE_TYPE), ifs.quality_index, 0);

        uint256 sub_id = quality_id + _subtokenIndex(quality_id);
        _mint(to, sub_id, 1, data);

        return sub_id;
    }
    

    function appendBlindBoxId(
        string calldata nfttype
    )
    external 
    payable 
    virtual
    returns(uint16)
    {
        require(_nfttype_names[nfttype] > 0, "not found nfttype, mint quality with nfttype");
        _blind_box_ids[_nfttype_names[nfttype]] = true;
        return _nfttype_names[nfttype];
    }

    function cancelBlindBoxId(
        string calldata nfttype
    ) 
    external 
    payable 
    virtual
    returns(uint16)
    {
        require(_nfttype_names[nfttype] > 0, "not found nfttype, mint quality with nfttype");
        _blind_box_ids[_nfttype_names[nfttype]] = false;
        return _nfttype_names[nfttype];
    }

    //-------------------f-internal----------------------------------------
    function _newQuality(
        string memory name
    )
    internal
    virtual
    returns(uint16) 
    {

        if(_quality_names[name] > 0) {
            return _quality_names[name];
        }

        _quality_pos                  = _quality_pos + 1;
        _quality_ids[_quality_pos]      = name;
        _quality_names[name]          = _quality_pos;
        return _quality_pos;
    }

    function _selectType(
        uint256 seed
    )
    internal
    virtual
    returns(uint16) 
    {
        return uint16((uint256(keccak256(abi.encodePacked(block.timestamp, seed))) %  _type_pos) + 1);
    }

    function _selectQuality(
        uint256 seed
    )
    internal
    virtual
    returns(uint16) 
    {
        return uint16((uint256(keccak256(abi.encodePacked(block.timestamp, seed))) %  _quality_pos) + 1);
        //return uint16((timestamp % _quality_pos) + 1);
    }

    function _newType(
        string memory name
    )
    internal
    virtual
    returns(uint16) 
    {
        if(_type_names[name] > 0) {
            return _type_names[name];
        }

        _type_pos                 = _type_pos + 1;
        _type_ids[_type_pos]      = name;
        _type_names[name]         = _type_pos;
        return _type_pos;
    }


    function _newBrand(
        string memory name
    )
    internal
    virtual
    returns(uint32) 
    {
        if(_brand_names[name] > 0) {
            return _brand_names[name];
        }

        _brand_pos                  = _brand_pos + 1;
        _brand_ids[_brand_pos]      = name;
        _brand_names[name]          = _brand_pos;
        return _brand_pos;
    }

    // general
    // blind-box
    function _newNftType(
        string memory name
    )
    internal
    virtual
    returns(uint16) 
    {
        //normal type is fix 1
        if(_nfttype_names[_NORMAL_TYPE] == 0) {
            _nfttype_pos = _nfttype_pos + 1;
            _nfttype_names[_NORMAL_TYPE]    = _nfttype_pos;
            _nfttype_ids[_nfttype_pos]      = _NORMAL_TYPE;
        }

        if(_nfttype_names[_EXCHANGE_TYPE] == 0) {
            _nfttype_pos = _nfttype_pos + 1;
            _nfttype_names[_EXCHANGE_TYPE]  = _nfttype_pos;
            _nfttype_ids[_nfttype_pos]      = _EXCHANGE_TYPE;
        }

        if(_nfttype_names[name] > 0) {
            return _nfttype_names[name];
        }

        _nfttype_pos = _nfttype_pos + 1;
        _nfttype_ids[_nfttype_pos]    = name;
        _nfttype_names[name]          = _nfttype_pos;
        return _nfttype_pos;
    }

    function _qualityIndex(
        uint256 id
    )
    internal
    virtual
    returns(uint32) 
    {
        _quality_index[id] = _quality_index[id] + 1;
        return _quality_index[id];
    }

    function _subtokenIndex(
        uint256 id
    )
    internal
    virtual
    returns(uint32) 
    {
          _subtoken_index[id] = _subtoken_index[id] + 1;
          return _subtoken_index[id];
    }

    function _splitId(
        uint256 id
    )
    internal
    virtual
    returns(IdFields memory ifs)
    {
        ifs.mark    = uint64(id >> 192);
        ifs.version = uint32(id >> 160);
        ifs.reserve = uint16(id >> 144);
        ifs.brand   = uint32(id >> 112);
        ifs.btype   = uint16(id >> 96);
        ifs.quality = uint16(id >> 80);
        ifs.nfttype = uint16(id >> 64);
        ifs.quality_index = uint32(id >> 32);
        ifs.subtoken_index = uint32(id);
    }

    function _createId(
        uint32 brand,
        uint16 btype,
        uint16 quality,
        uint16 nfttype,
        uint32 quality_index,
        uint32 subtoken_index
    )
    internal
    virtual
    returns(uint256) 
    {
        _nft_mark       = 0x8000000000000000;
        _nft_version    = 0;
        _nft_reserve    = 0;

        uint256 id = (uint256(_nft_mark) << 192) + 
            (uint256(_nft_version)   << 160) + 
            (uint256(_nft_reserve)   << 144) +
            (uint256(brand)          << 112) +
            (uint256(btype)          <<  96) +
            (uint256(quality)        <<  80) + 
            (uint256(nfttype)        <<  64) +
            (uint256(quality_index)  <<  32) +
            subtoken_index;

        return id;
    }

    uint256[50] private __gap;
}
