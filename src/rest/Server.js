"use strict";
var Util_1 = require("../Util");
var restify = require("restify");
var Communicator_1 = require("../controller/Communicator");
var Server = (function () {
    function Server(port) {
        Util_1.default.info("Server::<init>( " + port + " )");
        this.port = port;
    }
    Server.prototype.stop = function () {
        Util_1.default.info("Server::close()");
        var that = this;
        return new Promise(function (resolve) {
            that.rest.close(function () {
                resolve(true);
            });
        });
    };
    Server.prototype.start = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            try {
                Util_1.default.info("Server::start() - start");
                that.rest = restify.createServer({
                    name: "grocery"
                });
                that.rest.use(restify.bodyParser({
                    mapParams: true,
                    mapFiles: true,
                    requestBodyOnGet: true
                }));
                that.rest.get("/echo/:msg", Server.echo);
                that.rest.get(/.*/, restify.serveStatic({
                    directory: __dirname + "/public",
                    default: "index.html"
                }));
                that.rest.post("/send-data", function (req, res, next) {
                    Communicator_1.default.processInput(req.body)
                        .then(function (response) {
                        res.send(response);
                        return next();
                    })
                        .catch(function (err) {
                        res.send(err);
                        return next();
                    });
                });
                that.rest.post("/get-query", function (req, res, next) {
                    Communicator_1.default.getQueryData(req.body)
                        .then(function (response) {
                        res.send(response);
                        return next();
                    })
                        .catch(function (err) {
                        res.send(err);
                        return next();
                    });
                });
                that.rest.post("/update-table", function (req, res, next) {
                    Communicator_1.default.getData(req.body)
                        .then(function (response) {
                        res.send(response);
                        return next();
                    })
                        .catch(function (err) {
                        res.send(err);
                        return next();
                    });
                });
                that.rest.listen(that.port, function () {
                    Util_1.default.info("Server::start() - restify listening: " + that.rest.url);
                    resolve(true);
                });
                that.rest.on("error", function (err) {
                    Util_1.default.info("Server::start() - restify ERROR: " + err);
                    reject(err);
                });
            }
            catch (err) {
                Util_1.default.error("Server::start() - ERROR: " + err);
                reject(err);
            }
        });
    };
    Server.echo = function (req, res, next) {
        Util_1.default.trace("Server::echo(..) - params: " + JSON.stringify(req.params));
        return next();
    };
    return Server;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;
//# sourceMappingURL=Server.js.map