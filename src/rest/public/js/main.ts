//interface for warning suppression
interface Object {
    [key: string]: any;
}

let url: string = "http://localhost:4321",
    PKNK: any = {
        customerPK: ["membership_id"],
        customerNK: ["first_name", "last_name", "address", "phone_number", "join_date"],

        employeePK: ["employee_id"],
        employeeNK: ["first_name", "last_name", "sin", "wage"],

        payrollPK: ["employee_id", "start_date", "end_date"],
        payrollNK: ["hours_worked", "deductions", "gross_pay", "net_pay"],

        productPK: ["sku"],
        productNK: ["cost", "days_to_expiry", "supplier_name"],

        supplierPK: ["supplier_name", "location"],
        supplierNK: ["phone_number"]
    },
    entityDict: Object = {
        customer: PKNK.customerPK.concat(PKNK.customerNK),
        employee: PKNK.employeePK.concat(PKNK.employeeNK),
        payroll:  PKNK.payrollPK.concat(PKNK.payrollNK),
        product:  PKNK.productPK.concat(PKNK.productNK),
        supplier: PKNK.supplierPK.concat(PKNK.supplierNK)
    },
    type: Object = {
        /* Customer */
        membership_id: "NUMBER",
        first_name:    "VARCHAR2(30)",
        last_name:     "VARCHAR2(30)",
        address:       "VARCHAR2(30)",
        phone_number:  "VARCHAR2(30)",
        join_date:     "VARCHAR2(30)",

        /* Employee */
        employee_id: "NUMBER",
        // first_name: "VARCHAR2(30)",
        // last_name: "VARCHAR2(30)",
        sin:         "VARCHAR2(30)",
        wage:        "NUMBER",

        /* Payroll */
        // employee_id: "NUMBER",
        start_date:   "VARCHAR2(30)",
        end_date:     "VARCHAR2(30)",
        hours_worked: "VARCHAR2(30)",
        deductions:   "VARCHAR2(30)",
        gross_pay:    "VARCHAR2(30)",
        net_pay:      "VARCHAR2(30)",

        /* Product */
        sku:            "VARCHAR2(30)",
        cost:           "NUMBER",
        days_to_expiry: "NUMBER",
        // supplier_name: "VARCHAR2(30)",

        /* Supplier */
        supplier_name: "VARCHAR2(30)",
        location:      "VARCHAR2(30)",
        // phone_number: "VARCHAR2(30)"
    },
    confirmDrop: boolean = false;

function init(): void {
    $(function () {
        setDragTable();
        getTableData();
        toggleEntitySelection();
        toggleMethodSelection();
        toggleOperatorSelection();
        pressEnterToUpdateTable();
        toggleSort();
        selectEntity();
        selectMethod();
        selectOperator();
        dropCancel();
        dropProceed();
        sendProceed();
    });
}

/**
 * Sets all table to draggable type.
 */
function setDragTable() {
    $("table").removeData().dragtable();
}

/**
 * Returns the currently selected entity.
 */
function getEntity(): string {
    return $("#selected-entity").html().toLowerCase();
}

/**
 * Returns the currently selected method
 */
function getMethod(): string {
    return $("#selected-method").html().toLowerCase();
}

/**
 * Expands Entity selection (Employee, Customer, etc.)
 */
function toggleEntitySelection() {
    $("#selected-entity").on("click", function () {
        let entities = $("#entities");

        entities.css("display") === "none" ? entities.css("display", "flex")
            : entities.css("display", "none");
    });
}

/**
 * Expands Method selection (INSERT, UPDATE, etc.)
 */
function toggleMethodSelection() {
    let selector = $("#method-selector");

    selector.on("click", function () {
        if (selector.hasClass("success") || selector.hasClass("fail")) {
            return;
        }

        let methods = $("#methods");

        methods.css("display") === "none" ? methods.css("display", "flex")
            : methods.css("display", "none");
    });
}

/**
 * Expands Operator selection (=, !=, string regex, etc.)
 */
function toggleOperatorSelection() {
    $("table").on("click", ".operator-icon", function () {
        let selection = $(this).find(".operator-selection");
        selection.css("display", selection.css("display") === "none" ? "flex" : "none");
    });
}

/**
 * Choose a data type (Employee, Customer, etc.) to manipulate.
 */
function selectEntity() {
    $(".entity").on("click", function () {
        let selection: String = $(this).html();

        $("#selected-entity").html(selection);
        $("#entities").css("display", "none");

        createInputFields();
        insertTableColumns();
    });
}

/**
 * Choose a Method (INSERT, UPDATE, etc.).
 */
function selectMethod() {
    $(".method").on("click", function () {
        let method: string = $(this).html();

        $("#selected-method").html(decorateText(method));
        $("#methods").css("display", "none");

        createInputFields();
    });
}

/**
 * Choose an operator (=, >, A..., etc.).
 */
function selectOperator() {
    $("table").on("click", ".operator", function () {
        let that = $(this);

        that.parent().children(".operator").each(function () {
            $(this).removeClass("selected");
        });
        that.addClass("selected");
    });
}

/**
 * Toggles ascending or descending sort.
 */
function toggleSort() {
    $("table").on("click", ".sort", function () {
        let that = $(this);
        let isAscending = that.hasClass("fa-chevron-up");

        that.removeClass(isAscending ? "fa-chevron-up" : "fa-chevron-down")
            .addClass(isAscending ? "fa-chevron-down" : "fa-chevron-up");

        getTableData();
    })
}

function pressEnterToUpdateTable() {
    $("table input").keypress(function (event: any) {
        //13 is enter key
        if (event.which === 13) {
            getTableData();
        }
    });
}

/**
 * Creates the necessary input parameters for Object (Employee, Customer, etc.) and Method (Delete, Input, etc.).
 */
function createInputFields() {
    let fields: any = getAttributes(),
        htmlString: string = "";

    fields.forEach(function (field: string) {
        htmlString += "<input type=\"text\" placeholder=\"" + decorateText(field) + "\">";
    });

    $("#attribute-inputs").html(htmlString);
}

/**
 * Creates the table columns based on the current entity.
 */
function insertTableColumns() {
    let htmlStr = "";

    //create headers
    htmlStr += "<tr>" + entityDict[getEntity()].map(function (attr: string) {
        return "<th>" + decorateText(attr) + "</th>";
    }).join("") + "</tr>";

    //create specifications for each header (contains search bar, >=, A..., sorter, etc.)
    htmlStr += "<tr class=\"specification\">" + entityDict[getEntity()].map(function (attr: string) {
        if (type[attr] === "NUMBER") {
            return "<td>\n" +
                "                        <div class=\"operator-container-list\">\n" +
                "                            <div class=\"operator-icon fa fa-calculator\" aria-hidden=\"true\">\n" +
                "                                <div class=\"operator-selection\">\n" +
                "                                    <span class=\"operator selected\">=</span>\n" +
                "                                    <span class=\"operator\">!=</span>\n" +
                "                                    <span class=\"operator\">&gt;</span>\n" +
                "                                    <span class=\"operator\">&ge;</span>\n" +
                "                                    <span class=\"operator\">&lt;</span>\n" +
                "                                    <span class=\"operator\">&le;</span>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <span class=\"sort fa fa-chevron-up\" aria-hidden=\"true\"></span>\n" +
                "                        </div>\n" +
                "                        <div class=\"table-input\">\n" +
                "                            <span class=\"fa fa-search\" aria-hidden=\"true\"></span>\n" +
                "                            <input type=\"text\">\n" +
                "                        </div>\n" +
                "                    </td>";
        }

        return "<td>\n" +
            "            <div class=\"operator-container-list\">\n" +
            "                <div class=\"operator-icon fa fa-font\" aria-hidden=\"true\">\n" +
            "                    <div class=\"operator-selection\">\n" +
            "                        <span class=\"operator selected\">A</span>\n" +
            "                        <span class=\"operator\">A...</span>\n" +
            "                        <span class=\"operator\">...A</span>\n" +
            "                        <span class=\"operator\">...A...</span>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "                <span class=\"sort fa fa-chevron-up\" aria-hidden=\"true\"></span>\n" +
            "            </div>\n" +
            "            <div class=\"table-input\">\n" +
            "                <span class=\"fa fa-search\" aria-hidden=\"true\"></span>\n" +
            "                <input type=\"text\">\n" +
            "            </div>\n" +
            "        </td>";
    }).join("") + "</tr>";

    $("thead").html(htmlStr);
    $("tbody").html("");
    setDragTable();
}

/**
 * Converts the given string into something more user friendly.
 */
function decorateText(str: string) {
    switch (str) {
        case "customer_id":
            return "Customer ID";
        case "employee_id":
            return "Employee ID";
        case "membership_id":
            return "Membership ID";
        case "sin":
            return "SIN";
        case "sku":
            return "SKU";
        case "days_to_expiry":
            return "Days to Expiry";
        default:
            return str.replace(/_/g, " ").replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
    }
}

/**
 * Converts the given string into something suitable for the backend.
 */
function undecorateText(str: string) {
    return str.replace(/ /g, "_").toLowerCase();
}

/**
 * Returns the fields needed by the selected Object and Method.
 */
function getAttributes(): string[] {
    let entity: string = getEntity();

    switch (getMethod()) {
        case "delete":
            return PKNK[entity + "PK"];
        case "insert":
        case "update":
            return entityDict[entity];
        default:
            return [];
    }
}

/**
 * Sends client data to server for conversion into SQL statements.
 */
function sendData(): any {
    console.log(JSON.stringify({
        method: getMethod(),
        entity: getEntity(),
        inputs: getInput()
    }));

    return new Promise(function (resolve, reject) {
        return $.ajax({
            type:        getType(),
            url:         url + "/send-data",
            data:        JSON.stringify({
                method: getMethod(),
                entity: getEntity(),
                inputs: getInput()
            }),
            contentType: "application/json; charset=utf-8"
        })
            .then(function (res: any) {
                $("#attribute-inputs").find("input").each(function () {
                    $(this).val("");
                });
                buttonFeedback(true);
                getTableData();
                return resolve(res);
            })
            .catch(function (err: Error) {
                buttonFeedback(false);
                return reject(err);
            });
    });
}

/**
 * Animates confirmation for DROP TABLE.
 */
function dropConfirm() {
    $("#confirmation-container").css("display", "flex");
}

function dropCancel() {
    $("#drop-cancel").on("click", function () {
        restoreDrop();
        $("#confirmation-container").css("display", "none");
    });
}

/**
 * Restores DROP after confirming.
 */
function restoreDrop() {
    $("#selected-method").html("Drop");
    $("#confirmation-container").css("display", "none");
}

/**
 * Proceeds with DROP.
 */
function dropProceed() {
    $("#drop-confirm").on("click", function () {
        let method: any = $(this);

        restoreDrop();
        //close selection window
        $("#methods").css("display", "none");

        //send data to database
        method.removeClass("normal");
        sendData();
    });
}

function sendProceed() {
    $("#selected-method").on("click", function () {
        let method: any = $(this),
            methodStr: string = getMethod();

        //close selection window
        $("#methods").css("display", "none");

        if (!method.hasClass("normal")) {
            return;
        }

        //get data from database for INSERT, UPDATE, DELETE
        if (isEmptyInput() && (methodStr === "insert" || methodStr === "update" || methodStr === "delete")) {
            return getTableData();
        }

        if (methodStr === "drop") {
            dropConfirm();
            return;
        }

        //send data to database
        method.removeClass("normal");
        sendData();
    });
}

/**
 * Animates button feedback.
 */
function buttonFeedback(success: boolean): void {
    let method = $("#selected-method"),
        selection = $("#method-selector"),
        origMethod: String = method.html(),
        origIcon: String = selection.html();

    method.html(success ? "Done" : "Failed");
    selection.html(success ? "<span class=\"fa fa-check\" aria-hidden=\"true\"></span>"
        : "<span class=\"fa fa-times\" aria-hidden=\"true\"></span>");
    method.removeClass("normal").addClass(success ? "success" : "fail");
    selection.removeClass("normal").addClass(success ? "success" : "fail");

    setTimeout(function () {
        method.html(origMethod);
        selection.html(origIcon);
        method.removeClass("success fail").addClass("normal");
        selection.removeClass("success fail").addClass("normal");
    }, 1500);
}

/**
 * Retrieves entity data from the database.
 */
function getTableData(): any {
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type:        getType(),
            url:         url + "/update-table",
            data:        JSON.stringify(getSpecification()),
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
}

/**
 * Updates the Table HTML with the given response.
 */
function updateTable(res: any): void {
    let HTMLStr: String = res.rows.map(function (arr: any) {
        return "<tr>" + arr.map(function (elem: any) {
            return "<td>" + elem + "</td>";
        }).join("") + "</tr>";
    }).join("");

    $("tbody").html(HTMLStr);
    setDragTable();
}

/**
 * Returns the HTTP method type.
 */
function getType(): string {
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
function getInput(): Object {
    let inputObj: any = {};

    $("#attribute-inputs").children("input").each(function () {
        inputObj[undecorateText($(this).attr("placeholder"))] = $(this).val();
    });

    return inputObj;
}

/**
 * Checks if user input field(s) is empty.
 */
function isEmptyInput(): boolean {
    let isEmpty: boolean = true;

    $("#attribute-inputs").children("input").each(function () {
        if ($(this).val() !== "") {
            isEmpty = false;
            return false; //breaks loop
        }
    });

    return isEmpty;
}

/**
 * Returns the user specified conditions (specified by the gear/inputs on the table) as an object with properties:
 *      attributes:     list of attributes for an entity
 *      entity:         the currently selected entity
 *      inputs:         user inputs for filtering
 *      isAscendings:   ascending, descending
 *      method:         SELECT
 *      operators:      =, !=, >, regex
 *      size:           number of columns
 */
function getSpecification(): Object {
    let numColumns: number = $("thead tr:first-child > th").length,
        attributes: string[] = new Array<string>(3),
        operators: string[] = new Array<string>(3),
        isAscendings: string[] = new Array<string>(3),
        inputs: string[] = new Array<string>(3);

    for (let j: number = 0; j < numColumns; j++) {
        attributes[j] = undecorateText($("thead > tr:eq(0) > th:eq(" + j + ")").html());
        operators[j] = $("thead > tr:eq(1) > td:eq(" + j + ") .selected").html();
        isAscendings[j] = $("thead > tr:eq(1) > td:eq(" + j + ") .sort").hasClass("fa-chevron-up");
        inputs[j] = $("thead > tr:eq(1) > td:eq(" + j + ") input").val();
    }

    return {
        attributes:   attributes,
        entity:       getEntity(),
        inputs:       inputs,
        isAscendings: isAscendings,
        method:       "select",
        operators:    operators,
        size:         numColumns
    };
}

/**
 * Load window.
 */
window.onload = function () {
    init();
};
