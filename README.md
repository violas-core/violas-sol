# violas-sol
violas ethereum sol

## ViolasMProofMain

[ViolasMProofMain](ViolasMProofMain.sol) is violas erc20 mapping proof 

### depends

[ViolasMproofDatas](ViolasMproofDatas.sol)

## ViolasMproofDatas

[ViolasMproofDatas](ViolasMproofDatas.sol) is violas proof storage

### depends

[ViolasMProofState](ViolasMProofState.sol)

## ViolasMProofState

[ViolasMProofState](ViolasMProofState.sol) is violas proof state value ang change 


# install and new mapping transaction:

```
**Deploy**

  Deploy  ViolasMProofMain.sol  -> 0x3c725134d74D5c45B4E4ABd2e5e2a109b5541288 
  Deploy  ViolasMproofDatas.sol -> 0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d
  Deploy  ViolasMProofState.sol -> 0x0fC5025C764cE34df352757e82f7B5c4Df39A836

**Set Depend**
  //set support erc20 token
  ViolasMProofMain.updateToken(erc20_name, 0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99) 
  //set use proof datas contract
  ViolasMProofMain.upgradProofDatasAddress(0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d)

  //set use this contract which can usd it
  ViolasMproofDatas.upgradMainAddress(0x3c725134d74D5c45B4E4ABd2e5e2a109b5541288)
  //set state manage contract 
  ViolasMproofDatas.upgradStateAddress(0x0fC5025C764cE34df352757e82f7B5c4Df39A836)

**new mapping proof**
  ////IERC20 : ERC20 interface
  ////0x0fC5025C764cE34df352757e82f7B5c4Df39A836 : USDT contract address
    
    1. IERC20(0x0fC5025C764cE34df352757e82f7B5c4Df39A836).approve(0x3c725134d74D5c45B4E4ABd2e5e2a109b5541288, 10000)
    2. ViolasMProofMain.transferProof(0x0fC5025C764cE34df352757e82f7B5c4Df39A836, "this is proof datas")

**query mapping proof**
    1. version = ViolasMproofDatas.nextVersion
    2. ViolasMproofDatas.proofInfo(version - 1)
