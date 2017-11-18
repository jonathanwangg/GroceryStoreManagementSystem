function init() {
    $(function () {
        setDragTable();
        getTableData();
        toggleEntitySelection();
        toggleQuerySelection();
        toggleMethodSelection();
        toggleOperatorSelection();
        pressEnterToUpdateTable();
        pressEnterToInsertData();
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
        createInputFields();
        insertTableColumns();
        getTableData();
    });
}
function selectQuery() {
    $(".query").on("click", function () {
        var selection = $(this).html();
        $("#selected-query").html(selection);
        $("#queries").css("display", "none");
        createInputFields();
        insertTableColumns();
        getQueryData();
    });
}
function getQueryData() {
    var query = getCustomQuery(), input = getInput();
    if (query === "custom") {
        return;
    }
    if (customQueryInput[query].join("") !== ""
        && Object.keys(input).map(function (key) {
            return input[key];
        }).join("") === "") {
        return;
    }
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: "POST",
            url: url + "/get-query",
            data: JSON.stringify({
                query: query,
                inputs: input,
                specification: getSpecification()
            }),
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
        isCustomQuery() ? getQueryData() : getTableData();
    });
}
function pressEnterToUpdateTable() {
    $("table").on("keyup", "input", function (event) {
        if (event.which !== 13) {
            return;
        }
        getCustomQuery() ? getQueryData() : getTableData();
    });
}
function pressEnterToInsertData() {
    $("#data-container").on("keyup", "input", function (event) {
        if (event.which !== 13) {
            return;
        }
        getCustomQuery() ? getQueryData() : sendData();
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
        if (["NUMBER", "FLOAT", "INT"].includes(type[attr])) {
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
        case "transaction_id":
            return "Transaction ID";
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
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: "POST",
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
            type: "POST",
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
function getInput() {
    var inputObj = {};
    (isCustomQuery() ? $("#query-inputs").children("input") : $("#attribute-inputs").children("input"))
        .each(function () {
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