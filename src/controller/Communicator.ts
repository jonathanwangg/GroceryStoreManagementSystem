import Dictionary from "./Dictionary";

export default class Communicator {
    public static oracledb = require("oracledb");
    public static dbConfig = require("./dbconfig.js");

    public static setting = {
        user:          Communicator.dbConfig.user,
        password:      Communicator.dbConfig.password,
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
     * Hardcoded queries.
     */
    public static getQueryData(data: string): any {
        return new Promise(function (resolve, reject) {
            Communicator.communicate(Communicator.getHardQuery(data))
                .then(function (res: any) {
                    return resolve(res);
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    }

    /**
     * Returns the hardcoded query based on user specification.
     * data = {
     *      data.query = "max_pay", "sales_target", etc.
     *      data.inputs = required input fields for hardcoded queries
     *      data.specification = "user input on right-hand side table" IGNORE THIS FOR NOW, always blank
     * }
     */
    public static getHardQuery(data: any): string {
        let SQLStr: string = "";

        if (data.specification.inputs.join("") === "") {
            switch (data.query) {
                case "max_pay":
                    SQLStr = "SELECT *\n" +
                        "FROM employee\n" +
                        "WHERE wage >= ALL (SELECT wage\n" +
                        "FROM employee)";
                    break;
                case "sales_target":
                    SQLStr = "select e.*, result.target from employee e, " +
                        "(select e.employee_id AS id, SUM(r.quantity) AS target from employee e, processes p, receivesreceipt r " +
                        "where e.employee_id = p.employee_id AND r.transaction_id = p.transaction_id GROUP BY e.employee_id HAVING SUM(r.quantity)>" +
                        data.inputs['target'] + ") result where result.id = e.employee_id"
                    break;
                case "process_transaction":
                    let t_id: number = data.inputs["transaction_id"];
                    let m_id: number = data.inputs["membership_id"];
                    let e_id: number = data.inputs["employee_id"];
                    let p_type: string = data.inputs["payment_type"];
                    let sku: number = data.inputs["sku"];
                    let quantity: number = data.inputs["quantity"];
                    let updated_quantity = 5 - quantity; //TODO: get inventory quantity from database
                    console.log("PROCESS TRANSACTION");

                    SQLStr += "INSERT INTO Transaction VALUES (" + m_id + ",'2017-11-18'," + p_type + "," + e_id + ");\n" +
                        "INSERT INTO ReceivesReceipt VALUES (" + t_id + "," + sku + "," + m_id + "," + quantity + ");\n" +
                        "UPDATE Inventory SET quantity = " + updated_quantity + " where SKU = " + sku + ");\n" +
                        "INSERT INTO Processes VALUES (" + t_id + "," + e_id + "," + m_id + ");\n" +
                        "SELECT t.transaction_id, t.date_transaction, t.payment_type, t.employee_id, r.quantity, i.quantity, r.membership_id\n" +
                        "FROM Transaction t, ReceivesReceipt r, Inventory i\n" +
                        "WHERE t.transaction_id = r.transaction_id and r.sku = i.sku and t.transaction_id =" + t_id + "and r.sku = " + sku;
                    break;
                case "find_transaction_date":
                    SQLStr += "SELECT date_transaction \n" +
                        "FROM Transaction \n" +
                        "WHERE transaction_id  = " + data.inputs.transaction_id; // todo: user-input
                    break;
                case "employee_net_pay_amount":
                    return "SELECT employee_id, net_pay \n" +
                        "FROM Employee E, Payroll P \n" +
                        "WHERE E.employee_id = 3";  // todo: user-input in place of 3
                case "supplier_product_amount":
                    return "SELECT sku, delivery_quantity \n" +
                        "FROM Supplier S, Supply A, Product P \n" +
                        "WHERE S.supplier_name = A.supplier_name AND" +
                        "A.sku = P.sku AND P.sku = 3"; // todo: user-input in place of 3
                case "total_pay_view":
                    return "CREATE VIEW  TotalPay\n" +
                        "SELECT       start_date, SUM(net_pay)\n" +
                        "FROM         Payroll\n" +
                        "GROUP BY     start_date";

            }
        } else {
            //CUSTOM QUERY WITH USER INPUT IN TABLE FILTERS
        }

        console.log(SQLStr);
        return SQLStr;
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
            connection.execute(SQLStr, {}, {
                fetchInfo: {
                    JOIN_DATE:        {type: Communicator.oracledb.STRING},
                    START_DATE:       {type: Communicator.oracledb.STRING},
                    END_DATE:         {type: Communicator.oracledb.STRING},
                    DATE_TRANSACTION: {type: Communicator.oracledb.STRING}
                }
            }, function (err: Error, result: any) {
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
                let map: Object = {};

                data.attributes.forEach(function (key: string, i: number) {
                    if (data.inputs[i].length !== 0) {
                        map[key] = data.inputs[i];
                    } else {
                        delete data.operators[i];
                    }
                });

                SQLStr += "SELECT " + data.attributes.join(", ") + "\nFROM " + data.entity
                    + Communicator.getWHERE(Object.keys(map).length, Object.keys(map), data.operators.filter(function (value: any) {
                            return value !== 0;
                        }),
                        Object.keys(map).map(function (key: string) {
                            return map[key];
                        }))
                    + Communicator.getORDERBY(data.size, data.attributes, data.isAscendings);
                break;
            case "update":
                SQLStr += Communicator.update(entity, inputs);
                break;
            case "delete":
                let PK = Dictionary.PKNK[entity + "PK"];
                SQLStr += "DELETE FROM " + data.entity
                    + Communicator.getWHERE(PK.length, PK,
                        PK.map(function (key: any) {
                            return Dictionary.type[key] === "NUMBER" ? '=' : 'A';
                        }), PK.map(function (key: string) {
                            return inputs[key];
                        }));
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
     * Constructs UPDATE statement.
     */
    public static update(entity: string, inputs: Object) {
        let SQLStr = "UPDATE " + entity + "\nSET ",
            NK = Dictionary.PKNK[entity + "NK"].filter(function (key: string) {
                return inputs[key].length !== 0;
            }),
            PK = Dictionary.PKNK[entity + "PK"];

        SQLStr += NK.map(function (key: string) {
            return key + " = " + (Dictionary.type[key] === "NUMBER" ? inputs[key] : "'" + inputs[key] + "'");
        }).join(", ");

        return SQLStr + Communicator.getWHERE(PK.length, PK,
            PK.map(function () {
                return '=';
            }), PK.map(function (key: string) {
                return inputs[key];
            }));
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
            whereStr += Communicator.getWHERECondition(attributes[i], operators[i], inputs[i])
                + " AND ";
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
