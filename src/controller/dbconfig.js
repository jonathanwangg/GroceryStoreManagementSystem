module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "ora_s0f9",
    password: process.env.NODE_ORACLEDB_PASSWORD || "a41556127",
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost:1522/ug",
    externalAuth: !!process.env.NODE_ORACLEDB_EXTERNALAUTH
};
//# sourceMappingURL=dbconfig.js.map