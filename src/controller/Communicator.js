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
        var SQLStr = "";
        switch (data.query) {
            case "max_pay":
                SQLStr += "SELECT *\n" +
                    "   FROM   Employee\n" +
                    "   WHERE  wage >= ALL (SELECT wage\n" +
                    "                       FROM   employee)";
                break;
            case "sales_target":
                SQLStr += "SELECT e.*, result.target\n" +
                    "   FROM   Employee e, (SELECT   e.employee_id AS id, SUM(r.quantity) AS target\n" +
                    "                       FROM     Employee e, Processes p, ReceivesReceipt r\n" +
                    "                       WHERE    e.employee_id = p.employee_id AND r.transaction_id = p.transaction_id\n" +
                    "                       GROUP BY e.employee_id\n" +
                    "                       HAVING   SUM(r.quantity) > " + data.inputs["target"] + ") result\n" +
                    "   WHERE  result.id = e.employee_id";
                break;
            case "process_transaction":
                var t_id = data.inputs["transaction_id"], m_id = data.inputs["membership_id"], e_id = data.inputs["employee_id"], p_type = data.inputs["payment_type"], sku = data.inputs["sku"], quantity = data.inputs["quantity"], updated_quantity = 5 - quantity;
                console.log("PROCESS TRANSACTION");
                return "BEGIN\n" +
                    "INSERT INTO Customer VALUES (20,'Lea','Steinhaus','80 Maplewood Dr #345','905-618-8258','2011-11-05')\n" +
                    "INSERT INTO Customer VALUES (21,'Lea','Steinhaus','80 Maplewood Dr #345','905-618-8258','2011-11-05')\n" +
                    "END";
            case "find_transaction_date":
                SQLStr += "SELECT date_transaction\n" +
                    "      FROM   Transaction\n" +
                    "      WHERE  transaction_id  = " + data.inputs.transaction_id;
                break;
            case "employee_net_pay":
                SQLStr += "SELECT E.employee_id, net_pay\n" +
                    "      FROM   Employee E, Payroll P\n" +
                    "      WHERE  E.employee_id = " + data.inputs.employee_id;
                break;
            case "supplier_product_amt":
                SQLStr += "SELECT A.sku, delivery_quantity\n" +
                    "      FROM   Supplier S, Supply A, Product P\n" +
                    "      WHERE  S.supplier_name = A.supplier_name AND A.sku = P.sku AND P.sku = "
                    + data.inputs.sku;
                break;
            case "total_pay_view":
                SQLStr += "CREATE VIEW TotalPay\n" +
                    "      SELECT      start_date, SUM(net_pay) AS net_pay\n" +
                    "      FROM        Payroll\n" +
                    "      GROUP BY    start_date";
                break;
        }
        SQLStr = Communicator.getQueryWHERE(SQLStr, data.specification.size, data.specification.attributes, data.specification.operators, data.specification.inputs, data.specification.isAscendings);
        console.log(SQLStr);
        return SQLStr;
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
            connection.execute(SQLStr, {}, {
                fetchInfo: {
                    JOIN_DATE: { type: Communicator.oracledb.STRING },
                    START_DATE: { type: Communicator.oracledb.STRING },
                    END_DATE: { type: Communicator.oracledb.STRING },
                    DATE_TRANSACTION: { type: Communicator.oracledb.STRING }
                }
            }, function (err, result) {
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
        var entity = data.entity, inputs = data.inputs;
        switch (data.method) {
            case "create":
                return Communicator.create(entity);
            case "drop":
                return "DROP TABLE " + entity;
            case "insert":
                return Communicator.insert(entity, inputs);
            case "select":
                var map_1 = {};
                data.attributes.forEach(function (key, i) {
                    if (data.inputs[i].length !== 0) {
                        map_1[key] = data.inputs[i];
                    }
                    else {
                        delete data.operators[i];
                    }
                });
                return "SELECT " + data.attributes.join(", ") + "\nFROM " + data.entity
                    + Communicator.getWHERE(Object.keys(map_1).length, Object.keys(map_1), data.operators.filter(function (value) {
                        return value !== 0;
                    }), Object.keys(map_1).map(function (key) {
                        return map_1[key];
                    }))
                    + Communicator.getORDERBY(data.size, data.attributes, data.isAscendings);
            case "update":
                return Communicator.update(entity, inputs);
            case "delete":
                var PK = Dictionary_1.default.PKNK[entity + "PK"];
                return "DELETE FROM " + data.entity
                    + Communicator.getWHERE(PK.length, PK, PK.map(function (key) {
                        return Dictionary_1.default.type[key] === "NUMBER" ? '=' : 'A';
                    }), PK.map(function (key) {
                        return inputs[key];
                    }));
        }
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
            whereStr += Communicator.getWHERECondition(attributes[i], operators[i], inputs[i])
                + " AND ";
        }
        return whereStr.substring(0, whereStr.lastIndexOf(" AND "));
    };
    Communicator.getQueryWHERE = function (SQLStr, size, attributes, operators, inputs, isAscendings) {
        if (inputs.join("") === "") {
            return "SELECT " + attributes.join(", ") + "\nFROM (" + SQLStr + ")" + Communicator.getORDERBY(size, attributes, isAscendings);
        }
        var whereArr = [];
        for (var j = 0; j < size; j++) {
            if (inputs[j] !== "") {
                whereArr.push(Communicator.getWHERECondition(attributes[j], operators[j], inputs[j]));
            }
        }
        return "SELECT " + attributes.join(", ") + "\nFROM (" + SQLStr + ")\nWHERE " + whereArr.join(" AND ")
            + Communicator.getORDERBY(size, attributes, isAscendings);
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