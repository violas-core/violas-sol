



#flow
   HBTCToken ->  HBTCLogic -> HBTCStorage

## Deploy args:
contract    |   args    | desc
      ---   |   ---     | --- 
HBTCLogic   | HBTCToken Address |
HBTCStorage | HBTCLogic Address |

## Modify admin Address
  default： multi sign(2/3)

  1. vlslogic
  2. vlsstore

## Chang pause
  1. addAddress vlspauser
  2. pause

## Add vlsoperator
  addAddress vlsoperator  + wallet account
   

## mint 
  1. use HTBCTools(0x2eC5C9F9Ba0Db3d0E70DbF205AF7E7BDD022e3e8) create taskHase
  2. mint

