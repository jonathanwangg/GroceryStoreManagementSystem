Setting up Windows:
npm --add-python-to-path='true' --debug install --global windows-build-tools
npm install instantclient
set PATH=%cd%\instantclient;%PATH%
set OCI_LIB_DIR=%cd%\instantclient\sdk\lib\msvc
set OCI_INC_DIR=%cd%\instantclient\sdk\include
yarn clean
yarn install

Conneting to Oracle:
1) set up tunnel:
ssh -l g7s0b -L localhost:1522:dbhost.ugrad.cs.ubc.ca:1522 remote.ugrad.cs.ubc.ca
