"use strict";
var Dictionary = (function () {
    function Dictionary() {
    }
    return Dictionary;
}());
Dictionary.PKNK = {
    customerPK: ["membership_id"],
    customerNK: ["first_name", "last_name", "address", "phone_number", "join_date"],
    employeePK: ["employee_id"],
    employeeNK: ["first_name", "last_name", "sin", "wage", "position"],
    schedulePK: ["employee_id", "work_date"],
    scheduleNK: ["is_holiday", "start_time", "end_time"],
    payrollPK: ["employee_id", "start_date", "end_date"],
    payrollNK: ["hours_worked", "deductions", "gross_pay", "net_pay"],
    transactionPK: ["transaction_id"],
    transactionNK: ["date_transaction", "payment_type", "employee_id"],
    productPK: ["sku"],
    productNK: ["product_name", "cost", "days_to_expiry"],
    receivesReceiptPK: ["transaction_id", "sku", "membership_id"],
    receivesReceiptNK: ["quantity"],
    processesPK: ["transaction_id", "employee_id", "membership_id"],
    processesNK: [],
    supplierPK: ["supplier_name", "location"],
    supplierNK: ["phone_number"],
    supplyPK: ["delivery_id", "sku", "supplier_name", "location"],
    supplyNK: ["delivery_quantity", "bulk_cost"],
    inventoryPK: ["sku"],
    inventoryNK: ["quantity"],
    handlesPK: ["employee_id", "sku", "delivery_id", "supplier_name", "location"],
    handlesNK: [],
    modifiesPK: ["transaction_id", "sku"],
    modifiesNK: [],
    updatesPK: ["supplier_name", "location", "delivery_id", "sku"],
    updatesNK: []
};
Dictionary.objects = {
    customer: Dictionary.PKNK.customerPK.concat(Dictionary.PKNK.customerNK),
    employee: Dictionary.PKNK.employeePK.concat(Dictionary.PKNK.employeeNK),
    payroll: Dictionary.PKNK.payrollPK.concat(Dictionary.PKNK.payrollNK),
    product: Dictionary.PKNK.productPK.concat(Dictionary.PKNK.productNK),
    supplier: Dictionary.PKNK.supplierPK.concat(Dictionary.PKNK.supplierNK),
    receivesReceipt: Dictionary.PKNK.receivesReceiptPK.concat(Dictionary.PKNK.receivesReceiptNK),
    processes: Dictionary.PKNK.processesPK.concat(Dictionary.PKNK.processesNK),
    transaction: Dictionary.PKNK.transactionPK.concat(Dictionary.PKNK.transactionNK),
    supply: Dictionary.PKNK.supplyPK.concat(Dictionary.PKNK.supplyNK),
    handles: Dictionary.PKNK.handlesPK.concat(Dictionary.PKNK.handlesNK),
    schedule: Dictionary.PKNK.schedulePK.concat(Dictionary.PKNK.scheduleNK),
    inventory: Dictionary.PKNK.inventoryPK.concat(Dictionary.PKNK.inventoryNK),
    modifies: Dictionary.PKNK.modifiesPK.concat(Dictionary.PKNK.modifiesNK),
    updates: Dictionary.PKNK.updatesPK.concat(Dictionary.PKNK.updatesNK)
};
Dictionary.type = {
    membership_id: "NUMBER",
    first_name: "VARCHAR2(30)",
    last_name: "VARCHAR2(30)",
    address: "VARCHAR2(30)",
    phone_number: "VARCHAR2(30)",
    join_date: "DATE",
    employee_id: "NUMBER",
    sin: "VARCHAR2(30)",
    wage: "NUMBER",
    start_date: "DATE",
    end_date: "DATE",
    hours_worked: "VARCHAR2(30)",
    deductions: "VARCHAR2(30)",
    gross_pay: "VARCHAR2(30)",
    net_pay: "VARCHAR2(30)",
    transaction_id: "INT",
    date_transaction: "DATE",
    payment_type: "VARCHAR2(40)",
    sku: "VARCHAR2(30)",
    cost: "NUMBER",
    days_to_expiry: "NUMBER",
    supplier_name: "VARCHAR2(30)",
    location: "VARCHAR2(30)",
    quantity: "NUMBER",
    delivery_id: "NUMBER",
    delivery_quantity: "NUMBER",
    bulk_cost: "FLOAT",
    date: "DATE",
    is_holiday: "BIT",
    start_time: "DATE",
    end_time: "DATE",
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary;
//# sourceMappingURL=Dictionary.js.map