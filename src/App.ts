/**
 * Starts the server. It is unlikely you will have to change anything here.
 */
import Log from "./Util";
import Server from "./rest/Server";

/**
 * Starts the server; doesn't listen to whether the start was successful.
 */
export class App {
    public initServer(port: number) {
        Log.info("App::initServer( " + port + " ) - start");
      
        let s = new Server(port);
        s.start().then(function (val: boolean) {
            Log.info("App::initServer() - started: " + val);
        }).catch(function (err: Error) {
            Log.error("App::initServer() - ERROR: " + err.message);
        });
    }
}

// This ends up starting the whole system and listens on a hardcoded port (4321)
Log.info("App - starting");
let app = new App();
app.initServer(4321);
