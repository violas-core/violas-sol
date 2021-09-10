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
    uint16   private _nft_type;
    mapping(uint16 => string) private _nft_type_ids;
    mapping(string => uint16) private _nft_type_names;
    mapping(uint16 => bool)   private _blind_box_ids;

    //token_id(quality) index
    mapping(uint256 => uint32) private _quality_index;

    //token_id sub index
    mapping(uint256 => uint32) private _subtoken_index;

    //unique ids
    mapping(uint256 => bool)   private _unique_ids;

    string constant private _NORMAL_TYPE = "nomal";
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

                require(_unique_ids[id] == false, "id is exist, can not mint unique id.");

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
        return _nft_type;
    }

    function nftTypeName(
        uint16 id
    )
    public
    view
    virtual
    returns(string memory) 
    {
        return _nft_type_ids[id];
    }

    function nftTypeId(
        string memory name
    )
    internal
    view
    virtual
    returns(uint16) {
        return _nft_type_names[name];
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

        require(_unique_ids[id] == false, "id is exists");
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
        uint256 id = _createId(brand_id, type_id, 0, 0, 0, 0);

        require(_unique_ids[id] == false, "id is exist");
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

        uint256 id = qualityid + _subtokenIndex(qualityid);
        super.mint(to, id, amount, data);

        return id;
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
        
        uint256 quality_id = _createId(ifs.brand, ifs.btype, ifs.quality, ifs.nfttype, ifs.quality_index, 0);
        uint64 timestamp = uint64(block.timestamp);

        require(_unique_ids[quality_id] == true, "id is not exist");
        require(_blind_box_ids[ifs.nfttype] == true, "id is not blind box type");
        require(balanceOf(to, id) == 1, "amount is not 1. ");

        quality_id = _createId(ifs.brand, _selectType(timestamp), _selectQuality(timestamp), _newQuality(_NORMAL_TYPE), ifs.quality_index, 0);

        //这里应该是赋予兑换的功能。不应该是mint
        //mintSubToken(to, id, 1, data);
        return quality_id;
    }
    

    /*
    function setBlindBoxId(
        string calldata nfttype
    )
    external 
    virtual
    returns(uint16)
    {
        require(_nft_type_names[nfttype] > 0, "not found nfttype, mint quality with nfttype");
        _blind_box_ids[_nft_type_names[nfttype]] = true;
        return _nft_type_names[nfttype];
    }
    */
    //-------------------f-internal----------------------------------------
    function _newQuality(
        string memory name
    )
    internal
    virtual
    returns(uint16) 
    {
        //normal type is fix 1
        if(_quality_names[_NORMAL_TYPE] == 0) {
            _quality_pos = _quality_pos + 1;
            _quality_names[_NORMAL_TYPE] = _quality_pos;
        }

        if(_quality_names[name] > 0) {
            return _quality_names[name];
        }

        _quality_pos                  = _quality_pos + 1;
        _quality_ids[_quality_pos]      = name;
        _quality_names[name]          = _quality_pos;
        return _quality_pos;
    }

    function _selectType(
        uint64 timestamp
    )
    internal
    virtual
    returns(uint16) 
    {
        return uint16((timestamp % _type_pos) + 1);
    }

    function _selectQuality(
        uint64 timestamp
    )
    internal
    virtual
    returns(uint16) 
    {
        return uint16((timestamp % _quality_pos) + 1);
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
        if(_nft_type_names[name] > 0) {
            return _nft_type_names[name];
        }

        _nft_type = _nft_type + 1;
        _nft_type_ids[_nft_type]    = name;
        _nft_type_names[name]       = _nft_type;
        return _nft_type;
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
        ifs.mark    = uint64(id >> 191);
        ifs.version = uint32(id >> 159);
        ifs.reserve = uint16(id >> 143);
        ifs.brand   = uint32(id >> 111);
        ifs.btype   = uint16(id >> 95);
        ifs.quality = uint16(id >> 79);
        ifs.nfttype = uint16(id >> 63);
        ifs.quality_index = uint32(id >> 31);
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
        if (_nft_mark == 0) {
            _nft_mark       = 0x8000000000000000;
            _nft_version    = 0;
            _nft_reserve    = 0;
        }

        uint256 id = 0;
        id =_nft_mark       << 191 + 
            _nft_version    << 159 + 
            _nft_reserve    << 143 +
            brand           << 111 +
            btype           <<  95 +
            quality         <<  79 + 
            nfttype         <<  63 +
            quality_index   <<  31 +
            subtoken_index;

        return id;
    }

    uint256[50] private __gap;
}
