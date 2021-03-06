function init(): void {
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
    return $("#selected-entity").html().toLowerCase().replace(/ /g, "_");
}

/**
 * Returns the currently selected method.
 */
function getMethod(): string {
    return $("#selected-method").html().toLowerCase().replace(/ /g, "_");
}

/**
 * Returns the currently selected custom query.
 */
function getCustomQuery(): string {
    return $("#selected-query").html().toLowerCase().replace(/ /g, "_");
}

/**
 * Returns true if custom queries.
 */
function isCustomQuery(): boolean {
    return getMethod() === "send";
}

/**
 * Expands Entity selection (Employee, Customer, etc.).
 */
function toggleEntitySelection() {
    $("#selected-entity").on("click", function () {
        let entities = $("#entities");

        entities.css("display") === "none" ? entities.css("display", "block")
            : entities.css("display", "none");
    });
}

/**
 * Expands Query selection (Employee, Customer, etc.).
 */
function toggleQuerySelection() {
    $("#selected-query").on("click", function () {
        let queries = $("#queries");

        queries.css("display") === "none" ? queries.css("display", "block")
            : queries.css("display", "none");
    });
}

/**
 * Expands Method selection (INSERT, UPDATE, etc.).
 */
function toggleMethodSelection() {
    let selector = $("#method-selector");

    selector.on("click", function () {
        if (selector.hasClass("success") || selector.hasClass("fail")) {
            return;
        }

        let methods = $("#methods");

        methods.css("display") === "none" ? methods.css("display", "block")
            : methods.css("display", "none");
    });
}

/**
 * Expands Operator selection (=, !=, string regex, etc.).
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
        let selection: string = $(this).html();

        $("#selected-entity").html(selection);
        $("#entities").css("display", "none");

        createInputFields();
        insertTableColumns();
        getTableData();
    });
}

/**
 * Choose a query.
 */
function selectQuery() {
    $(".query").on("click", function () {
        let selection: string = $(this).html();

        $("#selected-query").html(selection);
        $("#queries").css("display", "none");

        createInputFields();
        insertTableColumns();
        getQueryData();
    });
}

/**
 * Retrieves entity data from the database.
 */
function getQueryData(): any {
    let query: string = getCustomQuery(),
        input: Object = getInput();

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
            type:        "POST",
            url:         url + "/get-query",
            data:        JSON.stringify({
                query:         query,
                inputs:        input,
                specification: getSpecification()
            }),
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
 * Choose a Method (INSERT, UPDATE, etc.).
 */
function selectMethod() {
    $(".method").on("click", function () {
        let method: string = $(this).html();

        $("#methods").css("display", "none");

        if (method === "Custom") {
            $("#selected-method").html("Send");
            expandCustomQuery();
        } else {
            $("#selected-method").html(decorateText(method));
            expandAttributeInput();
        }

        createInputFields();
        insertTableColumns();

        method === "Custom" ? getQueryData() : getTableData();
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

        isCustomQuery() ? getQueryData() : getTableData();
    })
}

/**
 * Press enter to update tables in text fields.
 */
function pressEnterToUpdateTable() {
    $("table").on("keyup", "input", function (event: any) {
        //13 is enter key
        if (event.which !== 13) {
            return;
        }

        getCustomQuery() ? getQueryData() : getTableData();
    });
}

/**
 * Press enter to insert input data.
 */
function pressEnterToInsertData() {
    $("#data-container").on("keyup", "input", function (event: any) {
        //13 is enter key
        if (event.which !== 13) {
            return;
        }

        getCustomQuery() ? getQueryData() : sendData();
    });
}

/**
 * Creates the necessary input parameters for Object (Employee, Customer, etc.) and Method (Delete, Input, etc.).
 */
function createInputFields(): void {
    let isCustom: boolean = isCustomQuery(),
        fields: string[] = isCustom ? customQueryInput[getCustomQuery()] : getAttributes(),
        htmlString: string = "";

    fields.forEach(function (field: string) {
        htmlString += "<input type=\"text\" placeholder=\"" + decorateText(field) + "\">";
    });

    isCustom ? $("#query-inputs").html(htmlString) : $("#attribute-inputs").html(htmlString);
}

/**
 * Expands the basic query pane.
 */
function expandAttributeInput(): void {
    $("#selected-query").css("display", "none");
    $("#queries").css("display", "none");
    $("#query-inputs").css("display", "none");
    $("#selected-entity").css("display", "flex");
    $("#entities").css("display", "none");
    $("#attribute-inputs").css("display", "flex");
}

/**
 * Expands the custom query pane.
 */
function expandCustomQuery(): void {
    $("#selected-entity").css("display", "none");
    $("#entities").css("display", "none");
    $("#attribute-inputs").css("display", "none");
    $("#selected-query").css("display", "flex");
    $("#queries").css("display", "none");
    $("#query-inputs").css("display", "flex");
}

/**
 * Creates the table columns based on the current entity.
 */
function insertTableColumns() {
    let htmlStr = "";
    let attributes: string[] = isCustomQuery() ? customQueryDict[getCustomQuery()] : entityDict[getEntity()];

    //create column headers
    htmlStr += "<tr>"
        + attributes.map(function (attr: string) {
            return "<th>" + decorateText(attr) + "</th>";
        }).join("") + "</tr>";

    //create specifications for each header (contains search bar, >=, A..., sorter, etc.)
    htmlStr += "<tr class=\"specification\">" + attributes.map(function (attr: string) {
        if (["NUMBER", "DECIMAL(19,2)", "INT"].includes(type[attr])) {
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

/**
 * Sends client data to server for conversion into SQL statements.
 */
function sendData(): any {
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type:        "POST",
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

/**
 * Animates confirmation for DROP TABLE.
 */
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
 * Proceeds with DROP function after confirmation.
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

/**
 * Proceeds with INSERT, UPDATE, DELETE, etc. other than DROP.
 */
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

        if (methodStr === "send") {
            getQueryData();
            return;
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
            type:        "POST",
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
    let HTMLStr: string = res.rows.map(function (arr: any) {
        let HTMLRowStr: string = "";

        for (let j: number = 0; j < res.metaData.length; j++) {
            let colName: string = res.metaData[j].name.toLowerCase();

            HTMLRowStr += "<td>" + (type[colName] === "DECIMAL(19,2)" ? arr[j].toFixed(2) : arr[j]) + "</td>";
        }

        return "<tr>" + HTMLRowStr + "</tr>";
    }).join("");

    $("tbody").html(HTMLStr);
    setDragTable();
}

/**
 * Creates a JavaScript Object using user defined inputs and settings.
 */
function getInput(): Object {
    let inputObj: any = {};

    (isCustomQuery() ? $("#query-inputs").children("input") : $("#attribute-inputs").children("input"))
        .each(function () {
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
