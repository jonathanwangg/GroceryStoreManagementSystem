/**
 * Created by rtholmes on 2016-06-20.
 */

/**
 * Collection of logging methods. Useful for making the output easier to read and understand.
 *
 * @param msg
 */
/* tslint:disable:no-console */
export default class Log {

    public static trace(msg: string) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    }

    public static info(msg: string) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    }

    public static warn(msg: string) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    }

    public static error(msg: string) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    }

    public static test(msg: string) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    }
}
