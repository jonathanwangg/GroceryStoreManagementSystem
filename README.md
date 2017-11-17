Setting up Windows (run everything in Windows CMD):
1) Install Node.js from the Node.js website
2) At the project root directory, run
    1) yarn clean
    2) yarn install
    3) npm --add-python-to-path='true' --debug install --global windows-build-tools (may take some time)
    4) npm install instantclient
3) Move the instantclient from the project root directory to C:\oracle\
4) Add "C:\oracle\instantclient" to PATHs by editing system environment variables
5) Run
    1) npm install oracledb
6) Alternatively for steps 3 and 4, run the following at the project root directory (must be done everytime)
    1) set PATH=%cd%\instantclient;%PATH%
    2) set OCI_LIB_DIR=%cd%\instantclient\sdk\lib\msvc
    3) set OCI_INC_DIR=%cd%\instantclient\sdk\include
7) Optionally run (to stop Webstorm warnings)
    1) npm install --save @types/jquery

Connecting remotely to UBC's server and running the local Node server:
1) Set up a tunnel on a LINUX shell (XXXX is your CS ID):
ssh -l XXXX -L localhost:1522:dbhost.ugrad.cs.ubc.ca:1522 remote.ugrad.cs.ubc.ca
If the above fails (due to IPv6 bug), try the following:
ssh -l XXXX -L 127.0.0.1:1522:dbhost.ugrad.cs.ubc.ca:1522 remote.ugrad.cs.ubc.ca
2) On Windows CMD at the project root, run
    1) npm start (to start server)
    2) ctrl+c (to stop server)
3) On your web browser, go to "localhost:4321"

Changing DateFormat:
Set the following environment variables:
1) set NLS_LANG ='American_America.UTF8'
2) set NLS_DATE_FORMAT='YYYY-MON-DD'
