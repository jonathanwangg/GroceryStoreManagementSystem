"use strict";
var Util_1 = require("./Util");
var Server_1 = require("./rest/Server");
var App = (function () {
    function App() {
    }
    App.prototype.initServer = function (port) {
        Util_1.default.info("App::initServer( " + port + " ) - start");
        var s = new Server_1.default(port);
        s.start().then(function (val) {
            Util_1.default.info("App::initServer() - started: " + val);
        }).catch(function (err) {
            Util_1.default.error("App::initServer() - ERROR: " + err.message);
        });
    };
    return App;
}());
exports.App = App;
Util_1.default.info("App - starting");
var app = new App();
app.initServer(4321);
//# sourceMappingURL=App.js.map