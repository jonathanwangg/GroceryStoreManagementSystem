var $document = $(document);
var url = "http://localhost:4321";
function init() {
    $(document).ready(function () {
        expandDataSelection();
        expandMethodSelection();
        selectField();
        selectMethod();
        sendData();
        getTableData();
    });
}
function expandDataSelection() {
    $("#selected-entity").on("click", function () {
        $(".data-selection").css("display", "flex");
    });
}
function expandMethodSelection() {
    $("#method-selection").on("click", function () {
        $(".method-selection").css("display", "flex");
    });
}
function selectField() {
    $(".field-selection").on("click", function () {
        var selection = $(this).html();
        $("#selected-entity").html(selection);
        $(".data-selection").css("display", "none");
        createInputFields();
    });
}
function selectMethod() {
    $(".method").on("click", function () {
        var method = $(this).html();
        $("#selected-method").html(method);
        $(".method-selection").css("display", "none");
        createInputFields();
    });
}
function createInputFields() {
    var fields = getFields(), htmlString = "";
    fields.forEach(function (field) {
        htmlString += "<input type=\"text\" placeholder=\"" + field + "\">\n";
    });
    $("#user-data-input").html(htmlString);
}
function getFields() {
    var method = $("#selected-method").html(), obj = $("#selected-entity").html(), customerPK = ["Membership ID"], customer = ["First Name", "Last Name", "Address", "Phone Number", "Join Date"], employeePK = ["Employee ID"], employee = ["First Name", "Last Name", "SIN", "Wage"], payrollPK = ["Employee ID", "Start Date", "End Date"], payroll = ["Hours Worked", "Deductions", "Gross Pay", "Net Pay"], productPK = ["SKU"], product = ["Cost", "Days to Expiry", "Supplier Name"], supplierPK = ["Supplier Name", "Location"], supplier = ["Phone Number"];
    switch (method) {
        case "Delete":
            switch (obj) {
                case "Customer":
                    return customerPK;
                case "Employee":
                    return employeePK;
                case "Payroll":
                    return payrollPK;
                case "Product":
                    return productPK;
                case "Supplier":
                    return supplierPK;
            }
            break;
        case "Insert":
        case "Update":
            switch (obj) {
                case "Customer":
                    return customerPK.concat(customer);
                case "Employee":
                    return employeePK.concat(employee);
                case "Payroll":
                    return payrollPK.concat(payroll);
                case "Product":
                    return productPK.concat(product);
                case "Supplier":
                    return supplierPK.concat(supplier);
            }
            break;
        default:
            return [];
    }
}
function sendData() {
    $("#selected-method").on("click", function () {
        return new Promise(function (resolve, reject) {
            return $.ajax({
                type: getType(),
                url: url + "/send-data",
                data: JSON.stringify({
                    method: $("#selected-method").html(),
                    entity: $("#selected-entity").html(),
                    inputs: getInput()
                }),
                contentType: "application/json; charset=utf-8"
            })
                .then(function (res) {
                $("#user-data-input").find("input").each(function () {
                    $(this).val("");
                });
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    });
}
function getTableData() {
    $("#view-table").on("click", function () {
        return new Promise(function (resolve, reject) {
            return $.ajax({
                type: getType(),
                url: url + "/update-table",
                data: JSON.stringify({ entity: $("#selected-entity").html() }),
                contentType: "application/json; charset=utf-8"
            })
                .then(function (res) {
                updateTable(res);
                return resolve(res);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    });
}
function updateTable(res) {
    var HTMLStr = "<tr>\n"
        + res.metaData.map(function (obj) {
            return "<th>" + obj.name.toLowerCase() + "</th>\n";
        }).join("") + "</tr>\n"
        + res.rows.map(function (arr) {
            return "<tr>\n" + arr.map(function (elem) {
                return "<td>" + elem + "</td>\n";
            }).join("") + "</tr>\n";
        }).join("");
    $("#table-data").html(HTMLStr);
}
function getType() {
    return "POST";
}
function getInput() {
    var inputObj = {};
    $("#user-data-input").find("input").each(function () {
        inputObj[$(this).attr("placeholder").replace(/ /g, "_").toLowerCase()] = $(this).val();
    });
    return inputObj;
}
window.onload = function () {
    init();
};
//# sourceMappingURL=main.js.map