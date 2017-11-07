"use strict";
var oracledb = require("oracledb");
var dbConfig = require("./dbconfig.js");
var Select = (function () {
    function Select() {
    }
    Select.insertStudent = function (obj) {
        return new Promise(function (resolve, reject) {
            console.log("INSERSTUDENTS PROMISE INITIATED : INSERT INTO tab1 VALUES ("
                + obj.nid + ", " + obj.name + ", " + obj.age + ")");
            oracledb.getConnection({
                user: dbConfig.user,
                password: dbConfig.password,
                connectString: dbConfig.connectString
            }, function (err, connection) {
                if (err) {
                    console.error(err.message);
                    return reject(err);
                }
                connection.execute("INSERT INTO tab1 " +
                    "VALUES (" + obj.nid + ", '" + obj.name + "', " + obj.age + ")", function (err, result) {
                    if (err) {
                        console.error(err.message);
                        Select.doRelease(connection);
                        return reject(err);
                    }
                    console.log(result.metaData);
                    console.log(result.rows);
                    Select.doRelease(connection);
                    return resolve(result);
                });
            });
        });
    };
    Select.doRelease = function (connection) {
        connection.commit()
            .then(function () {
            connection.close(function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
        });
    };
    return Select;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Select;
//# sourceMappingURL=Select.js.map