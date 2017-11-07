/* Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   select1.js
 *
 * DESCRIPTION
 *   Executes a basic query without using a connection pool or ResultSet.
 *   Uses Oracle's sample HR schema.
 *
 *   Scripts to create the HR schema can be found at:
 *   https://github.com/oracle/db-sample-schemas
 *
 *   For a connection pool example see webapp.js
 *   For a ResultSet example see resultset2.js
 *   For a query stream example see selectstream.js
 *   For a Promise example see promises.js
 *
 *****************************************************************************/
let oracledb = require("oracledb");
let dbConfig = require("./dbconfig.js");

export default class Select {
    //Get a non-pooled connection
    public static insertStudent(obj: any) {
        return new Promise(function (resolve, reject) {
            console.log("INSERSTUDENTS PROMISE INITIATED : INSERT INTO tab1 VALUES ("
                + obj.nid + ", " + obj.name + ", " + obj.age + ")");

            oracledb.getConnection(
                {
                    user: dbConfig.user,
                    password: dbConfig.password,
                    connectString: dbConfig.connectString
                },
                function (err: Error, connection: any) {
                    if (err) {
                        console.error(err.message);
                        return reject(err);
                    }

                    connection.execute(
                        // The statement to execute
                        // "SELECT * " +
                        // "FROM tab1 " +
                        // "WHERE nid = :id",
                        "INSERT INTO tab1 " +
                        "VALUES (" + obj.nid + ", '" + obj.name + "', " + obj.age + ")",
                        // "WHERE nid = :id",
                        // "INSERT INTO tab1 " +
                        // "VALUES (103, 'Carol', 42)",

                        // The "bind value" 180 for the "bind variable" :id
                        // [103, "Carol", 42],
                        // [100],

                        // Optional execute options argument, such as the query result format
                        // or whether to get extra metadata
                        // { outFormat: oracledb.OBJECT, extendedMetaData: true },

                        // The callback function handles the SQL execution results
                        function (err: Error, result: any) {
                            if (err) {
                                console.error(err.message);
                                Select.doRelease(connection);
                                return reject(err);
                            }

                            console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
                            console.log(result.rows);     // [ [ 180, 'Construction' ] ]
                            Select.doRelease(connection);

                            return resolve(result);
                        });
                });
        });
    }

    // Note: connections should always be released when not needed
    public static doRelease(connection: any) {
        connection.commit()
            .then(function () {
                connection.close(function (err: Error) {
                    if (err) {
                        console.error(err.message);
                    }
                });
            });
    }
}
