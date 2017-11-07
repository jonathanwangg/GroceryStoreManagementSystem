let $document = $(document);
let url: string = "http://localhost:4321";

function init(): void {
    $(document).ready(function () {
        $("#studentSubmit").on("click", enterStudent());
    });
}

function enterStudent() {
    return new Promise(function (resolve, reject) {
        console.log("INSERSTUDENTS CLIENT CALL 1/2");

        $("#studentSubmit").on("click", function () {
            console.log("START: insertStudent()");

            insertStudent()
                .then(function (inRes: any) {
                    console.log("TERMINATION :) : " + inRes);
                    return resolve(inRes);
                })
                .catch(function (err: Error) {
                    console.log("TERMINATION :(");
                    return reject(err);
                });
            console.log("END:   insertStudent()");
        });
    })
}

/**
 * Queries the server about "courses" and "rooms".
 */
function insertStudent(): any {
    console.log("INSERSTUDENTS CLIENT CALL 2/2");

    return $.ajax({
        type: "POST",
        url: url + "/insertStudent",
        data: JSON.stringify(getInput("#student-entry")),
        contentType: "application/json; charset=utf-8"
    });
}

function getInput(id: string): Object {
    let nid: number = $(id).find("input:nth-child(2)").val();
    let name: number = $(id).find("input:nth-child(4)").val();
    let age: number = $(id).find("input:nth-child(6)").val();

    return {nid: nid, name: name, age: age};
}

window.onload = function () {
    init();
};
