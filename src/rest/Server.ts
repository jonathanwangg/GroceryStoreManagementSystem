/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import Log from "../Util";
import restify = require("restify");
import Select from "../controller/Select";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info("Server::close()");
        let that = this;

        return new Promise(function (resolve) {
            that.rest.close(function () {
                resolve(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        let that = this;

        return new Promise(function (resolve, reject) {
            try {
                Log.info("Server::start() - start");

                that.rest = restify.createServer({
                    name: "grocery"
                });

                that.rest.use(restify.bodyParser({mapParams: true, mapFiles: true}));

                that.rest.get(/.*/, restify.serveStatic({
                    directory: __dirname + "/public",
                    default: "index.html"
                }));

                // provides the echo service
                // curl -is  http://localhost:4321/echo/myMessage
                that.rest.get("/echo/:msg", Server.echo);

                that.rest.post("/insertStudent", function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    // that.sendInsightResponse(req, res, next);
                    Select.insertStudent(req.body)
                    // Select.insertStudent(req.params.id)
                        .then(function (inRes) {
                            res.send(inRes);
                            return next();
                        })
                        .catch(function (inRes) {
                            res.send(inRes);
                            return next();
                        });
                });

                that.rest.listen(that.port, function () {
                    Log.info("Server::start() - restify listening: " + that.rest.url);
                    resolve(true);
                });

                that.rest.on("error", function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal node not using normal exceptions here
                    Log.info("Server::start() - restify ERROR: " + err);
                    reject(err);
                });
            } catch (err) {
                Log.error("Server::start() - ERROR: " + err);
                reject(err);
            }
        });
    }

    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace("Server::echo(..) - params: " + JSON.stringify(req.params));
        return next();
    }
}
