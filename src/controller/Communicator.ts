import Dictionary from "./Dictionary";

export default class Communicator {
    public static oracledb = require("oracledb");
    public static dbConfig = require("./dbconfig.js");
    public static setting = {
        user: Communicator.dbConfig.user,
        password: Communicator.dbConfig.password,
        connectString: Communicator.dbConfig.connectString
    };

    /**
     * Sends SQL to Oracle.
     */
    public static processInput(obj: any) {
        return new Promise(function (resolve, reject) {
            let SQLStr: String = Communicator.getSQLStr(obj);

            Communicator.communicate(SQLStr)
                .then(function (res: any) {
                    return resolve(res);
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    }

    /**
     * SELECT * FROM given entity.
     */
    public static getData(entity: String) {
        return new Promise(function (resolve, reject) {
            Communicator.communicate("SELECT * FROM " + entity.toLowerCase())
                .then(function (res: any) {
                    console.log(res);
                    return resolve(res);
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    }

    /**
     * oracledb.getConnection Promise wrapper.
     */
    public static connect() {
        return new Promise(function (resolve, reject) {
            return Communicator.oracledb.getConnection(Communicator.setting, function (err: Error, connection: any) {
                if (err) {
                    return reject(err);
                }

                return resolve(connection);
            });
        });
    }

    /**
     * oracledb.connection.execute Promise wrapper.
     */
    public static execute(connection: any, SQLStr: String) {
        return new Promise(function (resolve, reject) {
            connection.execute(SQLStr, function (err: Error, result: any) {
                if (err) {
                    Communicator.doRelease(connection)
                        .then(function () {
                            return reject(err);
                        })
                        .catch(function (err: Error) {
                            return reject(err);
                        });
                }

                Communicator.doRelease(connection)
                    .then(function () {
                        return resolve(result);
                    })
                    .catch(function (err: Error) {
                        return reject(err);
                    });
            });
        });
    }


    /**
     * Sends the given SQL command to the database.
     */
    public static communicate(SQLStr: String): any {
        return new Promise(function (resolve, reject) {
            Communicator.connect()
                .then(function (connection) {
                    return Communicator.execute(connection, SQLStr);
                })
                .then(function (result: any) {
                    return resolve(result);
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    }

    /**
     * Commits and releases the connection.
     */
    public static doRelease(connection: any) {
        return new Promise(function (resolve, reject) {
            connection.commit()
                .then(function () {
                    connection.close(function (err: Error) {
                        if (err) {
                            return reject(err);
                        }
                    });

                    return resolve();
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    }

    /**
     * Converts the given Object into SQL.
     */
    public static getSQLStr(obj: any): String {
        let SQLStr: String = "",
            entity: any = obj.entity.toLowerCase(),
            inputs: any = obj.inputs;
        console.log("Current method: " + obj.method);

        switch (obj.method) {
            case "Create":
                SQLStr += "CREATE TABLE " + entity + " (\n"
                    + Dictionary.objects[entity].map(function (key: any) {
                        if (Dictionary.PKNK[entity + "PK"].includes(key)) {
                            return key + " " + Dictionary.type[key] + " NOT NULL";
                        }
                        else {
                            return key + " " + Dictionary.type[key];
                        }
                    }).join(",\n")
                    + ",\nPRIMARY KEY (" + Dictionary.PKNK[entity + "PK"].join(", ") + "))";
                break;
            case "Drop":
                SQLStr += "DROP TABLE " + entity;
                break;
            case "Insert":
                SQLStr += "INSERT INTO " + entity + " ("
                    + Object.keys(inputs).join(", ") + ")" + "\nVALUES ("
                    + Object.keys(inputs).map(function (elem) {
                        if (Dictionary.type[elem] === "NUMBER") {
                            return inputs[elem];
                        }

                        return "\'" + inputs[elem] + "\'";
                    }).join(", ") + ")";
                break;
            case "Update":
                SQLStr += "INSERT INTO " + entity + " ("
                    + Object.keys(inputs).join(", ") + ")" + "\nVALUES ("
                    + Object.keys(inputs).map(function (elem) {
                        if (Dictionary.type[elem] === "NUMBER") {
                            return inputs[elem];
                        }

                        return "\'" + inputs[elem] + "\'";
                    }).join(", ") + ")";
                break;
        }

        console.log(SQLStr); //TODO: Delete this
        return SQLStr;
    }
}
