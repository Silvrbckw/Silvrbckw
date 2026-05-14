#!/bin/bash
export ETHDO_PASSPHRASE='John_is_4*5=20*PMarryNot3+6*MmU2764JayF3+$34Love*Son_Future*'
ethdo validator credentials set \
  --mnemonic='more tennis apple awesome clutch category scare spice cement basic velvet runway' \
  --path='m/12381/3600/0/0/0' \
  --withdrawal-address='0x426ca4a1D4b739D7825Adb9f8db67e37795d8BEa' \
  --genesis-validators-root='0xe34677b444a6037431a6bc1061f727df7ef1e741f4ccf52fe56b7e57a78e21f5' \
  --fork-version='0x00000000' \
  --offline --json --debug
