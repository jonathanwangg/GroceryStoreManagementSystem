"use strict";
var Log = (function () {
    function Log() {
    }
    Log.trace = function (msg) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.info = function (msg) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.warn = function (msg) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.error = function (msg) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.test = function (msg) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    };
    return Log;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Log;
//# sourceMappingURL=Util.js.map