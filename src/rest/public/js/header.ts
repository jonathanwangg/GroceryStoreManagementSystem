//interface for warning suppression
interface Object {
    [key: string]: any;
}

let url: string = "http://localhost:4321",
    PKNK: any = {
        customerPK: ["membership_id"],
        customerNK: ["first_name", "last_name", "address", "phone_number", "join_date"],

        employeePK: ["employee_id"],
        employeeNK: ["first_name", "last_name", "sin", "wage", "position"],

        payrollPK: ["employee_id", "start_date", "end_date"],
        payrollNK: ["hours_worked", "deductions", "gross_pay", "net_pay"],

        productPK: ["sku"],
        productNK: ["product_name", "cost", "days_to_expiry"],

        supplierPK: ["supplier_name", "location"],
        supplierNK: ["phone_number"]
    },
    entityDict: Object = {
        customer: PKNK.customerPK.concat(PKNK.customerNK),
        employee: PKNK.employeePK.concat(PKNK.employeeNK),
        payroll: PKNK.payrollPK.concat(PKNK.payrollNK),
        product: PKNK.productPK.concat(PKNK.productNK),
        supplier: PKNK.supplierPK.concat(PKNK.supplierNK)
    },
    //put columns you want displayed here
    customQueryDict: Object = {
        custom: [],
        max_pay: PKNK.employeePK.concat(PKNK.employeeNK),
        sales_target: PKNK.employeePK.concat(PKNK.employeeNK).concat(["target"]),
        process_transaction: ["transaction_id", "date_transaction", "payment_type", "employee_id", "membership_id",
            "sku", "quantity_inventory", "quantity_receipt"],
        find_transaction_date: ["date_transaction"],
        employee_net_pay: ["employee_id", "net_pay"],
        supplier_product_amt: ["sku", "delivery_quantity"],
        total_pay_view: ["start_date", "net_pay"],
    },
    //these are the user inputs required by the hard query
    customQueryInput: Object = {
        custom: [],
        max_pay: [],
        sales_target: ["target"],
        process_transaction: ["transaction_id", "employee_id", "membership_id", "payment_type", "sku", "quantity"],
        find_transaction_date: ["transaction_id"],
        employee_net_pay: ["employee_id"],
        supplier_product_amt: ["sku"],
        total_pay_view: []
    },
    type: Object = {
        /* Customer */
        membership_id: "INT",
        first_name: "VARCHAR2(40)",
        last_name: "VARCHAR2(40)",
        address: "VARCHAR2(40)",
        phone_number: "VARCHAR2(40)",
        join_date: "DATE",

        /* Employee */
        employee_id: "INT",
        //first_name: "VARCHAR2(40)",
        //last_name:  "VARCHAR2(40)",
        sin: "VARCHAR2(40)",
        wage: "FLOAT",
        position: "VARCHAR(40)",

        /* Payroll */
        //employee_id:  "INT",
        start_date: "DATE",
        end_date: "DATE",
        hours_worked: "FLOAT",
        deductions: "FLOAT",
        gross_pay: "FLOAT",
        net_pay: "FLOAT",

        /* Product */
        sku: "INT",
        product_name: "VARCHAR2(40)",
        cost: "FLOAT",
        days_to_expiry: "INT",

        /* Supplier */
        supplier_name: "VARCHAR2(40)",
        location: "VARCHAR2(40)",
        //phone_number:  "VARCHAR2(40)"

        /* Custom Queries */
        target: "NUMBER"
    };