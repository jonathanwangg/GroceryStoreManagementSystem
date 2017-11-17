module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "ora_g7s0b",
    password: process.env.NODE_ORACLEDB_PASSWORD || "a35468140",
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost:1522/ug",
    externalAuth: !!process.env.NODE_ORACLEDB_EXTERNALAUTH
};
//# sourceMappingURL=dbconfig.js.map