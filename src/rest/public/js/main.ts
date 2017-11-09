let $document = $(document);
let url: string = "http://localhost:4321";

function init(): void {
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

/**
 * Choose a data type (Employee, Customer, etc.) to manipulate.
 */
function selectField() {
    $(".field-selection").on("click", function () {
        let selection: String = $(this).html();

        $("#selected-entity").html(selection);
        $(".data-selection").css("display", "none");

        createInputFields();
    });
}

/**
 * Choose a method (Insert, Update, etc.).
 */
function selectMethod() {
    $(".method").on("click", function () {
        let method: String = $(this).html();

        $("#selected-method").html(method);
        $(".method-selection").css("display", "none");

        createInputFields();
    });
}

/**
 * Creates the necessary input parameters for Object (Employee, Customer, etc.) and Method (Delete, Input, etc.).
 */
function createInputFields() {
    let fields: any = getFields(),
        htmlString: string = "";

    fields.forEach(function (field: string) {
        htmlString += "<input type=\"text\" placeholder=\"" + field + "\">\n";
    });

    $("#user-data-input").html(htmlString);
}

/**
 * Returns the fields needed by the selected Object and Method.
 */
function getFields() {
    let method: String = $("#selected-method").html(),
        obj: String = $("#selected-entity").html(),
        customerPK = ["Membership ID"],
        customer = ["First Name", "Last Name", "Address", "Phone Number", "Join Date"],
        employeePK = ["Employee ID"],
        employee = ["First Name", "Last Name", "SIN", "Wage"],
        payrollPK = ["Employee ID", "Start Date", "End Date"],
        payroll = ["Hours Worked", "Deductions", "Gross Pay", "Net Pay"],
        productPK = ["SKU"],
        product = ["Cost", "Days to Expiry", "Supplier Name"],
        supplierPK = ["Supplier Name", "Location"],
        supplier = ["Phone Number"];

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

/**
 * Sends client data to server for conversion into SQL statements.
 */
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
                .then(function (res: any) {
                    $("#user-data-input").find("input").each(function () {
                        $(this).val("");
                    });
                    return resolve(res);
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    });
}

/**
 * Retrieves entity data from the database.
 */
function getTableData() {
    $("#view-table").on("click", function () {
        return new Promise(function (resolve, reject) {
            return $.ajax({
                type: getType(),
                url: url + "/update-table",
                data: JSON.stringify({entity: $("#selected-entity").html()}),
                contentType: "application/json; charset=utf-8"
            })
                .then(function (res: any) {
                    updateTable(res);
                    return resolve(res);
                })
                .catch(function (err: Error) {
                    return reject(err);
                });
        });
    });
}

/**
 * Updates the Table HTML with the given response.
 */
function updateTable(res: any) {
    let HTMLStr: String = "<tr>\n"
        + res.metaData.map(function (obj: any) {
            return "<th>" + obj.name.toLowerCase() + "</th>\n"
        }).join("") + "</tr>\n"
        + res.rows.map(function (arr: any) {
            return "<tr>\n" + arr.map(function (elem: any) {
                return "<td>" + elem + "</td>\n";
            }).join("") + "</tr>\n";
        }).join("");

    $("#table-data").html(HTMLStr);
}

/**
 * Returns the HTTP method type.
 */
function getType() {
    //TODO: Fix the HTTP methods
    // switch ($("#selected-method").html()) {
    //     case "Insert":
    //         return "POST";
    //     case "Update":
    //         return "PUT";
    //     case "Delete":
    //         return "DELETE";
    //     case "SELECT":
    //         return "GET";
    //     case "Create":
    //         return "WHAT?"; //TODO: Fix this
    //     case "Drop":
    //         return "WHAT?"; //TODO: Fix this
    // }
    return "POST";
}

/**
 * Creates a JavaScript Object using user defined inputs and settings.
 */
function getInput() {
    let inputObj: any = {};

    $("#user-data-input").find("input").each(function () {
        inputObj[$(this).attr("placeholder").replace(/ /g, "_").toLowerCase()] = $(this).val();
    });

    return inputObj;
}

/**
 * Load window.
 */
window.onload = function () {
    init();
};
