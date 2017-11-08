var $document = $(document);
var url = "http://localhost:4321";
function init() {
    $(document).ready(function () {
        $("#studentSubmit").on("click", enterStudent());
        expandDataSelection();
        selectField();
    });
}
function expandDataSelection() {
    $("#selected-data").on("click", function () {
        $(".data-selection").css("display", "flex");
    });
}
function selectField() {
    $(".field-selection").on("click", function () {
        var selection = $(this).html();
        $("#selected-data").html(selection);
        $(".data-selection").css("display", "none");
        createInputFields(selection);
    });
}
function createInputFields(selection) {
    var fields = [], htmlString = "";
    switch (selection) {
        case "Customer":
            fields = ["Membership ID*", "First Name", "Last Name", "Address", "Phone Number", "Join Date"];
            break;
        case "Employee":
            fields = ["Employee ID*", "First Name", "Last Name", "SIN", "Wage"];
            break;
        case "Payroll":
            fields = ["Employee ID*", "Start Date*", "End Date*", "Hours Worked", "Deductions", "Gross Pay", "Net Pay"];
            break;
        case "Product":
            fields = ["SKU*", "Cost", "Days to Expiry", "Supplier Name"];
            break;
        case "Supplier":
            fields = ["Supplier Name*", "Location*", "Phone Number"];
            break;
    }
    fields.forEach(function (field) {
        htmlString += "<input type=\"text\" placeholder=\"" + field + "\">\n";
    });
    $("#user-data-input").html(htmlString);
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