var url = "http://localhost:4321", PKNK = {
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
}, entityDict = {
    customer: PKNK.customerPK.concat(PKNK.customerNK),
    employee: PKNK.employeePK.concat(PKNK.employeeNK),
    payroll: PKNK.payrollPK.concat(PKNK.payrollNK),
    product: PKNK.productPK.concat(PKNK.productNK),
    supplier: PKNK.supplierPK.concat(PKNK.supplierNK)
}, customQueryDict = {
    max_pay: PKNK.employeePK.concat(PKNK.employeeNK),
    sales_target: PKNK.employeePK.concat(PKNK.employeeNK).concat(["target"]),
    process_transaction: ["transaction_id", "date_transaction", "payment_type", "employee_id", "quantity_customer", "quantity_inventory", "membership_id"]
}, customQueryInput = {
    max_pay: [],
    sales_target: ["target"],
    process_transaction: ["transaction_id", "membership_id", "sku"]
}, type = {
    membership_id: "NUMBER",
    first_name: "VARCHAR2(30)",
    last_name: "VARCHAR2(30)",
    address: "VARCHAR2(30)",
    phone_number: "VARCHAR2(30)",
    join_date: "VARCHAR2(30)",
    employee_id: "NUMBER",
    sin: "VARCHAR2(30)",
    wage: "NUMBER",
    start_date: "VARCHAR2(30)",
    end_date: "VARCHAR2(30)",
    hours_worked: "VARCHAR2(30)",
    deductions: "VARCHAR2(30)",
    gross_pay: "VARCHAR2(30)",
    net_pay: "VARCHAR2(30)",
    sku: "VARCHAR2(30)",
    cost: "NUMBER",
    days_to_expiry: "NUMBER",
    supplier_name: "VARCHAR2(30)",
    location: "VARCHAR2(30)",
    target: "NUMBER"
};
function init() {
    $(function () {
        setDragTable();
        getTableData();
        toggleEntitySelection();
        toggleQuerySelection();
        toggleMethodSelection();
        toggleOperatorSelection();
        pressEnterToUpdateTable();
        toggleSort();
        selectEntity();
        selectQuery();
        selectMethod();
        selectOperator();
        dropCancel();
        dropProceed();
        sendProceed();
    });
}
function setDragTable() {
    $("table").removeData().dragtable();
}
function getEntity() {
    return $("#selected-entity").html().toLowerCase().replace(/ /g, "_");
}
function getMethod() {
    return $("#selected-method").html().toLowerCase().replace(/ /g, "_");
}
function getCustomQuery() {
    return $("#selected-query").html().toLowerCase().replace(/ /g, "_");
}
function isCustomQuery() {
    return getMethod() === "send";
}
function toggleEntitySelection() {
    $("#selected-entity").on("click", function () {
        var entities = $("#entities");
        entities.css("display") === "none" ? entities.css("display", "block")
            : entities.css("display", "none");
    });
}
function toggleQuerySelection() {
    $("#selected-query").on("click", function () {
        var queries = $("#queries");
        queries.css("display") === "none" ? queries.css("display", "block")
            : queries.css("display", "none");
    });
}
function toggleMethodSelection() {
    var selector = $("#method-selector");
    selector.on("click", function () {
        if (selector.hasClass("success") || selector.hasClass("fail")) {
            return;
        }
        var methods = $("#methods");
        methods.css("display") === "none" ? methods.css("display", "block")
            : methods.css("display", "none");
    });
}
function toggleOperatorSelection() {
    $("table").on("click", ".operator-icon", function () {
        var selection = $(this).find(".operator-selection");
        selection.css("display", selection.css("display") === "none" ? "flex" : "none");
    });
}
function selectEntity() {
    $(".entity").on("click", function () {
        var selection = $(this).html();
        $("#selected-entity").html(selection);
        $("#entities").css("display", "none");
        if (["Customer", "Employee", "Payroll", "Product", "Supplier"].includes(selection)) {
            createInputFields();
        }
        else {
            $("#attribute-inputs").html("");
        }
        insertTableColumns();
        getTableData();
    });
}
function selectQuery() {
    $(".query").on("click", function () {
        var selection = $(this).html();
        $("#selected-query").html(selection);
        $("#queries").css("display", "none");
        if (["sales_target"].includes(selection.toLowerCase().replace(/ /g, "_").toLowerCase())) {
            createInputFields();
        }
        else {
            $("#query-inputs").html("");
        }
        insertTableColumns();
        getTableData();
    });
}
function getQueryData() {
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: getType(),
            url: url + "/get-query",
            data: JSON.stringify({ query: getCustomQuery(), specification: getSpecification() }),
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
}
function selectMethod() {
    $(".method").on("click", function () {
        var method = $(this).html();
        $("#methods").css("display", "none");
        if (method === "Custom") {
            $("#selected-method").html("Send");
            expandCustomQuery();
        }
        else {
            $("#selected-method").html(decorateText(method));
            expandAttributeInput();
        }
        createInputFields();
        insertTableColumns();
        method === "Custom" ? getQueryData() : getTableData();
    });
}
function selectOperator() {
    $("table").on("click", ".operator", function () {
        var that = $(this);
        that.parent().children(".operator").each(function () {
            $(this).removeClass("selected");
        });
        that.addClass("selected");
    });
}
function toggleSort() {
    $("table").on("click", ".sort", function () {
        var that = $(this);
        var isAscending = that.hasClass("fa-chevron-up");
        that.removeClass(isAscending ? "fa-chevron-up" : "fa-chevron-down")
            .addClass(isAscending ? "fa-chevron-down" : "fa-chevron-up");
        getTableData();
    });
}
function pressEnterToUpdateTable() {
    $("table input").keypress(function (event) {
        if (event.which !== 13) {
            return;
        }
        $("#selected-entity").css("display") === "none" ? getQueryData() : getTableData();
    });
}
function createInputFields() {
    var isCustom = isCustomQuery(), fields = isCustom ? customQueryInput[getCustomQuery()] : getAttributes(), htmlString = "";
    fields.forEach(function (field) {
        htmlString += "<input type=\"text\" placeholder=\"" + decorateText(field) + "\">";
    });
    isCustom ? $("#query-inputs").html(htmlString) : $("#attribute-inputs").html(htmlString);
}
function expandAttributeInput() {
    $("#selected-query").css("display", "none");
    $("#queries").css("display", "none");
    $("#query-inputs").css("display", "none");
    $("#selected-entity").css("display", "flex");
    $("#entities").css("display", "none");
    $("#attribute-inputs").css("display", "flex");
}
function expandCustomQuery() {
    $("#selected-entity").css("display", "none");
    $("#entities").css("display", "none");
    $("#attribute-inputs").css("display", "none");
    $("#selected-query").css("display", "flex");
    $("#queries").css("display", "none");
    $("#query-inputs").css("display", "flex");
}
function insertTableColumns() {
    var htmlStr = "";
    var attributes = isCustomQuery() ? customQueryDict[getCustomQuery()] : entityDict[getEntity()];
    htmlStr += "<tr>"
        + attributes.map(function (attr) {
            return "<th>" + decorateText(attr) + "</th>";
        }).join("") + "</tr>";
    htmlStr += "<tr class=\"specification\">" + attributes.map(function (attr) {
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
function decorateText(str) {
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
function undecorateText(str) {
    return str.replace(/ /g, "_").toLowerCase();
}
function getAttributes() {
    var entity = getEntity();
    switch (getMethod()) {
        case "delete":
            if (PKNK[entity + "PK"]) {
                return PKNK[entity + "PK"];
            }
            return [];
        case "insert":
        case "update":
            if (entityDict[entity]) {
                return entityDict[entity];
            }
            return [];
        default:
            return [];
    }
}
function sendData() {
    console.log(JSON.stringify({
        method: getMethod(),
        entity: getEntity(),
        inputs: getInput()
    }));
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: getType(),
            url: url + "/send-data",
            data: JSON.stringify({
                method: getMethod(),
                entity: getEntity(),
                inputs: getInput()
            }),
            contentType: "application/json; charset=utf-8"
        })
            .then(function (res) {
            $("#attribute-inputs").find("input").each(function () {
                $(this).val("");
            });
            buttonFeedback(true);
            getTableData();
            return resolve(res);
        })
            .catch(function (err) {
            buttonFeedback(false);
            return reject(err);
        });
    });
}
function dropConfirm() {
    $("#confirmation-container").css("display", "flex");
}
function dropCancel() {
    $("#drop-cancel").on("click", function () {
        restoreDrop();
        $("#confirmation-container").css("display", "none");
    });
}
function restoreDrop() {
    $("#selected-method").html("Drop");
    $("#confirmation-container").css("display", "none");
}
function dropProceed() {
    $("#drop-confirm").on("click", function () {
        var method = $(this);
        restoreDrop();
        $("#methods").css("display", "none");
        method.removeClass("normal");
        sendData();
    });
}
function sendProceed() {
    $("#selected-method").on("click", function () {
        var method = $(this), methodStr = getMethod();
        $("#methods").css("display", "none");
        if (!method.hasClass("normal")) {
            return;
        }
        if (isEmptyInput() && (methodStr === "insert" || methodStr === "update" || methodStr === "delete")) {
            return getTableData();
        }
        if (methodStr === "send") {
            getQueryData();
            return;
        }
        if (methodStr === "drop") {
            dropConfirm();
            return;
        }
        method.removeClass("normal");
        sendData();
    });
}
function buttonFeedback(success) {
    var method = $("#selected-method"), selection = $("#method-selector"), origMethod = method.html(), origIcon = selection.html();
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
function getTableData() {
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: getType(),
            url: url + "/update-table",
            data: JSON.stringify(getSpecification()),
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
}
function updateTable(res) {
    var HTMLStr = res.rows.map(function (arr) {
        return "<tr>" + arr.map(function (elem) {
            return "<td>" + elem + "</td>";
        }).join("") + "</tr>";
    }).join("");
    $("tbody").html(HTMLStr);
    setDragTable();
}
function getType() {
    return "POST";
}
function getInput() {
    var inputObj = {};
    $("#attribute-inputs").children("input").each(function () {
        inputObj[undecorateText($(this).attr("placeholder"))] = $(this).val();
    });
    return inputObj;
}
function isEmptyInput() {
    var isEmpty = true;
    $("#attribute-inputs").children("input").each(function () {
        if ($(this).val() !== "") {
            isEmpty = false;
            return false;
        }
    });
    return isEmpty;
}
function getSpecification() {
    var numColumns = $("thead tr:first-child > th").length, attributes = new Array(3), operators = new Array(3), isAscendings = new Array(3), inputs = new Array(3);
    for (var j = 0; j < numColumns; j++) {
        attributes[j] = undecorateText($("thead > tr:eq(0) > th:eq(" + j + ")").html());
        operators[j] = $("thead > tr:eq(1) > td:eq(" + j + ") .selected").html();
        isAscendings[j] = $("thead > tr:eq(1) > td:eq(" + j + ") .sort").hasClass("fa-chevron-up");
        inputs[j] = $("thead > tr:eq(1) > td:eq(" + j + ") input").val();
    }
    return {
        attributes: attributes,
        entity: getEntity(),
        inputs: inputs,
        isAscendings: isAscendings,
        method: "select",
        operators: operators,
        size: numColumns
    };
}
window.onload = function () {
    init();
};
//# sourceMappingURL=main.js.map