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
        supplierNK: ["phone_number"]
    };

    public static objects: any = {
        customer: Dictionary.PKNK.customerPK.concat(Dictionary.PKNK.customerNK),
        employee: Dictionary.PKNK.employeePK.concat(Dictionary.PKNK.employeeNK),
        payroll: Dictionary.PKNK.payrollPK.concat(Dictionary.PKNK.payrollNK),
        product: Dictionary.PKNK.productPK.concat(Dictionary.PKNK.productNK),
        supplier: Dictionary.PKNK.supplierPK.concat(Dictionary.PKNK.supplierNK)
    };

    public static type: any = {
        /* Customer */
        membership_id: "NUMBER",
        first_name: "VARCHAR2(30)",
        last_name: "VARCHAR2(30)",
        address: "VARCHAR2(30)",
        phone_number: "VARCHAR2(30)",
        join_date: "VARCHAR2(30)",

        /* Employee */
        employee_id: "NUMBER",
        // first_name: "VARCHAR2(30)",
        // last_name: "VARCHAR2(30)",
        sin: "VARCHAR2(30)",
        wage: "NUMBER",

        /* Payroll */
        // employee_id: "NUMBER",
        start_date: "VARCHAR2(30)",
        end_date: "VARCHAR2(30)",
        hours_worked: "VARCHAR2(30)",
        deductions: "VARCHAR2(30)",
        gross_pay: "VARCHAR2(30)",
        net_pay: "VARCHAR2(30)",

        /* Product */
        sku: "VARCHAR2(30)",
        cost: "NUMBER",
        days_to_expiry: "NUMBER",
        // supplier_name: "VARCHAR2(30)",

        /* Supplier */
        supplier_name: "VARCHAR2(30)",
        location: "VARCHAR2(30)",
        // phone_number: "VARCHAR2(30)"
    };
}
