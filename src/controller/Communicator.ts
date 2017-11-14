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
    public static processInput(data: Object): any {
        return new Promise(function (resolve, reject) {
            let SQLStr: string = Communicator.getSQLStr(data);

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
    public static getData(data: Object): any {
        return new Promise(function (resolve, reject) {
            Communicator.communicate(Communicator.getSQLStr(data))
                .then(function (res: any) {
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
    public static connect(): any {
        return new Promise(function (resolve, reject) {
            Communicator.oracledb.getConnection(Communicator.setting, function (err: Error, connection: any) {
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
    public static execute(connection: any, SQLStr: string): any {
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
    public static communicate(SQLStr: string): any {
        return new Promise(function (resolve, reject) {
            Communicator.connect()
                .then(function (connection: any) {
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
    public static doRelease(connection: any): any {
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
    public static getSQLStr(data: any): string {
        let SQLStr: string = "",
            entity: string = data.entity,
            inputs: Object = data.inputs;

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
                //SELECT allColumns FROM entity
                SQLStr += "SELECT " + data.attributes.join(", ") + "\nFROM " + data.entity
                    + Communicator.getWHERE(data.size, data.attributes, data.operators, data.inputs)
                    + Communicator.getORDERBY(data.size, data.attributes, data.isAscendings);
                break;
            case "update":
                SQLStr = "UPDATE " + entity + "\nSET ";

                let filteredKeys = Object.keys(inputs).filter(function (key) {
                    return inputs[key].length != 0;
                })
                let updateColumns = '';
                filteredKeys.forEach(function (key) {
                    updateColumns += key + ' = ' + inputs[key] + ', ';
                })

                let size;
                switch (entity) {
                    case "customer":
                        size = Dictionary.PKNK.customerPK.length;
                        break;
                    case "employee":
                        size = Dictionary.PKNK.employeePK.length;
                        break;
                    case "payroll":
                        size = Dictionary.PKNK.payrollPK.length;
                        break;
                    case "product":
                        size = Dictionary.PKNK.productPK.length;
                        break;
                    case "supplier":
                        size = Dictionary.PKNK.supplierPK.length;
                        break;
                }

                let values = Object.keys(inputs).map(function (key) {
                    return inputs[key];
                });

                SQLStr += updateColumns.slice(0,-2) + Communicator.getWHERE(size, Object.keys(inputs),['=','=','='] , values);
                break;
        }

        console.log(SQLStr + "\n"); //TODO: Delete this
        return SQLStr;
    }

    /**
     * Constructs CREATE statement.
     */
    public static create(entity: string) {
        return "CREATE TABLE " + entity + " (\n"
            + Dictionary.objects[entity].map(function (key: any) {
                if (Dictionary.PKNK[entity + "PK"].includes(key)) {
                    return key + " " + Dictionary.type[key] + " NOT NULL";
                }
                else {
                    return key + " " + Dictionary.type[key];
                }
            }).join(",\n")
            + ",\nPRIMARY KEY (" + Dictionary.PKNK[entity + "PK"].join(", ") + "))";
    }

    /**
     * Constructs INSERT statement.
     */
    public static insert(entity: string, inputs: Object): string {
        return "INSERT INTO " + entity + " ("
            + Object.keys(inputs).join(", ") + ")" + "\nVALUES ("
            + Object.keys(inputs).map(function (elem) {
                if (Dictionary.type[elem] === "NUMBER") {
                    return inputs[elem];
                }

                return "\'" + inputs[elem] + "\'";
            }).join(", ") + ")";
    }

    /**
     * Constructs WHERE statement based on the given specifications.
     */
    public static getWHERE(size: number, attributes: string[], operators: string[], inputs: string[]): string {
        if (inputs.join("") === "") {
            return "";
        }

        let whereStr: string = "\nWHERE ";

        for (let i: number = 0; i < size; i++) {
            if (inputs[i] !== "") {
                whereStr += Communicator.getWHERECondition(attributes[i], operators[i], inputs[i])
                    + " AND ";
            }
        }

        return whereStr.substring(0, whereStr.lastIndexOf(" AND "));
    }

    /**
     * Constructs a subcondition for WHERE.
     */
    public static getWHERECondition(attribute: string, operator: string, input: string) {
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
    }

    /**
     * Constructs ORDER BY statement based on the given specifications.
     */
    public static getORDERBY(size: number, attributes: string[], isAscendings: boolean[]): string {
        let orderStr: string = "\nORDER BY ";

        for (let i: number = 0; i < size; i++) {
            orderStr += attributes[i] + (isAscendings[i] ? " ASC" : " DESC") + ", ";
        }

        return orderStr.substring(0, orderStr.lastIndexOf(", "));
    }
}
