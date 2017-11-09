"use strict";
var Dictionary_1 = require("./Dictionary");
var Communicator = (function () {
    function Communicator() {
    }
    Communicator.processInput = function (obj) {
        return new Promise(function (resolve, reject) {
            var SQLStr = Communicator.getSQLStr(obj);
            Communicator.communicate(SQLStr)
                .then(function (res) {
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.getData = function (entity) {
        return new Promise(function (resolve, reject) {
            Communicator.communicate("SELECT * FROM " + entity.toLowerCase())
                .then(function (res) {
                console.log(res);
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.connect = function () {
        return new Promise(function (resolve, reject) {
            return Communicator.oracledb.getConnection(Communicator.setting, function (err, connection) {
                if (err) {
                    return reject(err);
                }
                return resolve(connection);
            });
        });
    };
    Communicator.execute = function (connection, SQLStr) {
        return new Promise(function (resolve, reject) {
            connection.execute(SQLStr, function (err, result) {
                if (err) {
                    Communicator.doRelease(connection)
                        .then(function () {
                        return reject(err);
                    })
                        .catch(function (err) {
                        return reject(err);
                    });
                }
                Communicator.doRelease(connection)
                    .then(function () {
                    return resolve(result);
                })
                    .catch(function (err) {
                    return reject(err);
                });
            });
        });
    };
    Communicator.communicate = function (SQLStr) {
        return new Promise(function (resolve, reject) {
            Communicator.connect()
                .then(function (connection) {
                return Communicator.execute(connection, SQLStr);
            })
                .then(function (result) {
                return resolve(result);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.doRelease = function (connection) {
        return new Promise(function (resolve, reject) {
            connection.commit()
                .then(function () {
                connection.close(function (err) {
                    if (err) {
                        return reject(err);
                    }
                });
                return resolve();
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.getSQLStr = function (obj) {
        var SQLStr = "", entity = obj.entity.toLowerCase(), inputs = obj.inputs;
        console.log("Current method: " + obj.method);
        switch (obj.method) {
            case "Create":
                SQLStr += "CREATE TABLE " + entity + " (\n"
                    + Dictionary_1.default.objects[entity].map(function (key) {
                        if (Dictionary_1.default.PKNK[entity + "PK"].includes(key)) {
                            return key + " " + Dictionary_1.default.type[key] + " NOT NULL";
                        }
                        else {
                            return key + " " + Dictionary_1.default.type[key];
                        }
                    }).join(",\n")
                    + ",\nPRIMARY KEY (" + Dictionary_1.default.PKNK[entity + "PK"].join(", ") + "))";
                break;
            case "Drop":
                SQLStr += "DROP TABLE " + entity;
                break;
            case "Insert":
                SQLStr += "INSERT INTO " + entity + " ("
                    + Object.keys(inputs).join(", ") + ")" + "\nVALUES ("
                    + Object.keys(inputs).map(function (elem) {
                        if (Dictionary_1.default.type[elem] === "NUMBER") {
                            return inputs[elem];
                        }
                        return "\'" + inputs[elem] + "\'";
                    }).join(", ") + ")";
                break;
            case "Update":
                SQLStr += "INSERT INTO " + entity + " ("
                    + Object.keys(inputs).join(", ") + ")" + "\nVALUES ("
                    + Object.keys(inputs).map(function (elem) {
                        if (Dictionary_1.default.type[elem] === "NUMBER") {
                            return inputs[elem];
                        }
                        return "\'" + inputs[elem] + "\'";
                    }).join(", ") + ")";
                break;
        }
        console.log(SQLStr);
        return SQLStr;
    };
    return Communicator;
}());
Communicator.oracledb = require("oracledb");
Communicator.dbConfig = require("./dbconfig.js");
Communicator.setting = {
    user: Communicator.dbConfig.user,
    password: Communicator.dbConfig.password,
    connectString: Communicator.dbConfig.connectString
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Communicator;
//# sourceMappingURL=Communicator.js.map