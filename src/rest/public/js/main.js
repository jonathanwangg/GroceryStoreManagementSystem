var $document = $(document);
var url = "http://localhost:4321";
function init() {
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
                .then(function (inRes) {
                console.log("TERMINATION :) : " + inRes);
                return resolve(inRes);
            })
                .catch(function (err) {
                console.log("TERMINATION :(");
                return reject(err);
            });
            console.log("END:   insertStudent()");
        });
    });
}
function insertStudent() {
    console.log("INSERSTUDENTS CLIENT CALL 2/2");
    return $.ajax({
        type: "POST",
        url: url + "/insertStudent",
        data: JSON.stringify(getInput("#student-entry")),
        contentType: "application/json; charset=utf-8"
    });
}
function getInput(id) {
    var nid = $(id).find("input:nth-child(2)").val();
    var name = $(id).find("input:nth-child(4)").val();
    var age = $(id).find("input:nth-child(6)").val();
    return { nid: nid, name: name, age: age };
}
window.onload = function () {
    init();
};
//# sourceMappingURL=main.js.map