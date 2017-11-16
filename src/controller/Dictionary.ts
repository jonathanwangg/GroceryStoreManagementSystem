/**
 * Collection of dictionaries for the different Objects.
 */
export default class Dictionary {
    public static PKNK: any = {
        customerPK: ["membership_id"],
        customerNK: ["first_name", "last_name", "address", "phone_number", "join_date"],

        employeePK: ["employee_id"],
        employeeNK: ["first_name", "last_name", "sin", "wage"],

        payrollPK: ["employee_id", "start_date", "end_date"],
        payrollNK: ["hours_worked", "deductions", "gross_pay", "net_pay"],

        productPK: ["sku"],
        productNK: ["cost", "days_to_expiry", "supplier_name"],

        supplierPK: ["supplier_name", "location"],
        supplierNK: ["phone_number"],

        receivesReceiptPK: ["transaction_id", "sku", "membership_id"],
        receivesReceiptNK: ["quantity"],

        processesPK: ["transaction_id", "employee_id", "membership_id"],
        processesNK: [],

        transactionPK: ["transaction_id"],
        transactionNK: ["date_transaction", "payment_type", "employee_id"],

        supplyPK: ["delivery_id", "sku", "supplier_name", "location"],
        supplyNK: ["delivery_quantity", "bulk_cost"],

        handlesPK: ["employee_id", "sku", "delivery_id", "supplier_name", "location"],
        handlesNK: [],

        schedulePK: ["employee_id", "date"],
        scheduleNK: ["is_holiday", "start_time", "end_time"],

        inventoryPK: ["sku"],
        inventoryNK: ["quantity"],

        modifiesPK: ["transaction_id", "sku"],
        modifiesNK: [],

        updatesPK: ["supplier_name", "location", "delivery_id", "sku"],
        updatesNK: []
    };

    public static objects: any = {
        customer:        Dictionary.PKNK.customerPK.concat(Dictionary.PKNK.customerNK),
        employee:        Dictionary.PKNK.employeePK.concat(Dictionary.PKNK.employeeNK),
        payroll:         Dictionary.PKNK.payrollPK.concat(Dictionary.PKNK.payrollNK),
        product:         Dictionary.PKNK.productPK.concat(Dictionary.PKNK.productNK),
        supplier:        Dictionary.PKNK.supplierPK.concat(Dictionary.PKNK.supplierNK),
        receivesReceipt: Dictionary.PKNK.receivesReceiptPK.concat(Dictionary.PKNK.receivesReceiptNK),
        processes:       Dictionary.PKNK.processesPK.concat(Dictionary.PKNK.processesNK),
        transaction:     Dictionary.PKNK.transactionPK.concat(Dictionary.PKNK.transactionNK),
        supply:          Dictionary.PKNK.supplyPK.concat(Dictionary.PKNK.supplyNK),
        handles:         Dictionary.PKNK.handlesPK.concat(Dictionary.PKNK.handlesNK),
        schedule:        Dictionary.PKNK.schedulePK.concat(Dictionary.PKNK.scheduleNK),
        inventory:       Dictionary.PKNK.inventoryPK.concat(Dictionary.PKNK.inventoryNK),
        modifies:        Dictionary.PKNK.modifiesPK.concat(Dictionary.PKNK.modifiesNK),
        updates:         Dictionary.PKNK.updatesPK.concat(Dictionary.PKNK.updatesNK)
    };

    public static type: any = {
        /* Customer */
        membership_id: "NUMBER",
        first_name:    "VARCHAR2(30)",
        last_name:     "VARCHAR2(30)",
        address:       "VARCHAR2(30)",
        phone_number:  "VARCHAR2(30)",
        join_date:     "DATE",

        /* Employee */
        employee_id: "NUMBER",
        // first_name: "VARCHAR2(30)",
        // last_name: "VARCHAR2(30)",
        sin:         "VARCHAR2(30)",
        wage:        "NUMBER",

        /* Payroll */
        // employee_id: "NUMBER",
        start_date:   "DATE",
        end_date:     "DATE",
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

        /* ReceivesReceipt */
        transaction_id: "NUMBER",
        // sku: "NUMBER",
        // membership_id: "NUMBER",
        quantity:       "NUMBER",

        /* Processes */
        // transaction_id: "NUMBER",
        // employee_id: "NUMBER",
        // membership_id: "NUMBER",

        /* Transaction */
        // transaction_id: "NUMBER",
        date_transaction: "DATE",
        payment_type:     "placeholder value", // todo: we said we would be using an enum here?????
        // employee_id: "NUMBER",

        /* Supply */
        delivery_id:       "NUMBER",
        // sku: "NUMBER",
        // supplier_name: "VARCHAR2(30)",
        // location: "VARCHAR2(30)",
        delivery_quantity: "NUMBER",
        bulk_cost:         "FLOAT",

        /* Handles */
        // employee_id: "NUMBER",
        // sku: "NUMBER",
        // delivery_id: "NUMBER",
        // supplier_name: "VARCHAR2(30)",
        // location: "VARCHAR2(30)",

        /* Schedule */
        // employee_id: "NUMBER",
        date:       "DATE",
        is_holiday: "BIT",
        start_time: "DATE",          // todo: using DATEDIFF() to compute time between start and end
        end_time:   "DATE",

        /* Inventory */
        // sku: "NUMBER",
        // quantity: "NUMBER",

        /* Modifies */
        // transaction_id: "NUMBER",
        // sku: "NUMBER",

        /* Updates */
        // supplier_name: "VARCHAR2(30)",
        // location: "VARCHAR2(30)",
        // delivery_id: "NUMBER",
        // sku: "NUMBER",
    };
}
