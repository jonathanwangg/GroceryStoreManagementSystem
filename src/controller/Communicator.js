"use strict";
var Dictionary_1 = require("./Dictionary");
var Communicator = (function () {
    function Communicator() {
    }
    Communicator.processInput = function (data) {
        return new Promise(function (resolve, reject) {
            var SQLStr = Communicator.getSQLStr(data);
            Communicator.communicate(SQLStr)
                .then(function (res) {
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.getData = function (data) {
        return new Promise(function (resolve, reject) {
            Communicator.communicate(Communicator.getSQLStr(data))
                .then(function (res) {
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.getQueryData = function (data) {
        return new Promise(function (resolve, reject) {
            Communicator.communicate(Communicator.getHardQuery(data))
                .then(function (res) {
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    Communicator.getHardQuery = function (data) {
        if (data.specification.inputs.join("") === "") {
            switch (data.query) {
                case "max_pay":
                    return "SELECT *\n" +
                        "FROM employee\n" +
                        "WHERE wage >= ALL (SELECT wage\n" +
                        "FROM employee)";
            }
        }
        else {
        }
    };
    Communicator.connect = function () {
        return new Promise(function (resolve, reject) {
            Communicator.oracledb.getConnection(Communicator.setting, function (err, connection) {
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
    Communicator.getSQLStr = function (data) {
        var SQLStr = "", entity = data.entity, inputs = data.inputs;
        switch (data.method) {
            case "create":
                SQLStr += Communicator.create(entity);
                break;
            case "drop":
                SQLStr += "DROP TABLE " + entity;
                break;
            case "insert":
                SQLStr += Communicator.insert(entity, inputs);
                break;
            case "select":
                return SQLStr += "SELECT " + data.attributes.join(", ") + "\nFROM " + data.entity
                    + Communicator.getWHERE(data.size, data.attributes, data.operators, data.inputs)
                    + Communicator.getORDERBY(data.size, data.attributes, data.isAscendings);
            case "update":
                SQLStr += Communicator.update(entity, inputs);
                break;
            case "delete":
                SQLStr += "DELETE FROM " + data.entity + "\n"
                    + Communicator.getWHERE(data.size, data.attributes, data.operators, data.inputs);
                break;
        }
        console.log(SQLStr + "\n");
        return SQLStr;
    };
    Communicator.create = function (entity) {
        return "CREATE TABLE " + entity + " (\n"
            + Dictionary_1.default.objects[entity].map(function (key) {
                if (Dictionary_1.default.PKNK[entity + "PK"].includes(key)) {
                    return key + " " + Dictionary_1.default.type[key] + " NOT NULL";
                }
                else {
                    return key + " " + Dictionary_1.default.type[key];
                }
            }).join(",\n")
            + ",\nPRIMARY KEY (" + Dictionary_1.default.PKNK[entity + "PK"].join(", ") + "))";
    };
    Communicator.insert = function (entity, inputs) {
        return "INSERT INTO " + entity + " ("
            + Object.keys(inputs).join(", ") + ")" + "\nVALUES ("
            + Object.keys(inputs).map(function (elem) {
                if (Dictionary_1.default.type[elem] === "NUMBER") {
                    return inputs[elem];
                }
                return "\'" + inputs[elem] + "\'";
            }).join(", ") + ")";
    };
    Communicator.update = function (entity, inputs) {
        var SQLStr = "UPDATE " + entity + "\nSET ", NK = Dictionary_1.default.PKNK[entity + "NK"].filter(function (key) {
            return inputs[key].length !== 0;
        }), PK = Dictionary_1.default.PKNK[entity + "PK"];
        SQLStr += NK.map(function (key) {
            return key + " = " + (Dictionary_1.default.type[key] === "NUMBER" ? inputs[key] : "'" + inputs[key] + "'");
        }).join(", ");
        return SQLStr + Communicator.getWHERE(PK.length, PK, PK.map(function () {
            return '=';
        }), PK.map(function (key) {
            return inputs[key];
        }));
    };
    Communicator.getWHERE = function (size, attributes, operators, inputs) {
        if (inputs.join("") === "") {
            return "";
        }
        var whereStr = "\nWHERE ";
        for (var i = 0; i < size; i++) {
            if (inputs[i] !== "") {
                whereStr += Communicator.getWHERECondition(attributes[i], operators[i], inputs[i])
                    + " AND ";
            }
        }
        return whereStr.substring(0, whereStr.lastIndexOf(" AND "));
    };
    Communicator.getWHERECondition = function (attribute, operator, input) {
        switch (operator) {
            case "=":
                return attribute + " = " + input;
            case "!=":
            case "&ne;":
                return attribute + " <> " + input;
            case ">":
            case "&gt;":
                return attribute + " > " + input;
            case "≥":
            case "&ge;":
                return "(" + attribute + "=" + input + " OR " + attribute + ">" + input + ")";
            case "<":
            case "&lt;":
                return attribute + " < " + input;
            case "≤":
            case "&le;":
                return "(" + attribute + "=" + input + " OR " + attribute + "<" + input + ")";
            case "A":
                return attribute + " = " + "'" + input + "'";
            case "!A":
                return attribute + " <> '" + input + "'";
            case "A...":
                return attribute + " LIKE '" + input + "%'";
            case "...A":
                return attribute + " LIKE '%" + input + "'";
            case "...A...":
                return attribute + " LIKE '%" + input + "%'";
        }
    };
    Communicator.getORDERBY = function (size, attributes, isAscendings) {
        var orderStr = "\nORDER BY ";
        for (var i = 0; i < size; i++) {
            orderStr += attributes[i] + (isAscendings[i] ? " ASC" : " DESC") + ", ";
        }
        return orderStr.substring(0, orderStr.lastIndexOf(", "));
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