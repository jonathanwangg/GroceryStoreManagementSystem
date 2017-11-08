Setting up Windows:

Run these in Windows CMD:
1) yarn clean
2) yarn install
3) npm --add-python-to-path='true' --debug install --global windows-build-tools
4) npm install instantclient
5) set PATH=%cd%\instantclient;%PATH%
6) set OCI_LIB_DIR=%cd%\instantclient\sdk\lib\msvc
7) set OCI_INC_DIR=%cd%\instantclient\sdk\include
8) npm install oracledb

Conneting to Oracle:
ssh -l g7s0b -L localhost:1522:dbhost.ugrad.cs.ubc.ca:1522 remote.ugrad.cs.ubc.ca
2) On Windows CMD, run "npm start"
3) On your web browser, go to "localhost:4321"
4) Insert something (may need to change ID as it is unique)
http://www.ugrad.cs.ubc.ca/~g7s0b/oracle-test-modified.php