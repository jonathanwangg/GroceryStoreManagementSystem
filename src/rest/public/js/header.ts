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

        schedulePK: ["employee_id", "work_date"],
        scheduleNK: ["is_holiday", "start_time", "end_time"],

        payrollPK: ["employee_id", "start_date", "end_date"],
        payrollNK: ["hours_worked", "deductions", "gross_pay", "net_pay"],

        transactionPK: ["transaction_id"],
        transactionNK: ["date_transaction", "payment_type", "employee_id"],

        productPK: ["sku"],
        productNK: ["product_name", "cost", "days_to_expiry"],

        receivesreceiptPK: ["transaction_id", "sku", "membership_id"],
        receivesreceiptNK: ["quantity"],

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
    },
    entityDict: Object = {
        customer: PKNK.customerPK.concat(PKNK.customerNK),
        employee: PKNK.employeePK.concat(PKNK.employeeNK),
        payroll: PKNK.payrollPK.concat(PKNK.payrollNK),
        product: PKNK.productPK.concat(PKNK.productNK),
        supplier: PKNK.supplierPK.concat(PKNK.supplierNK),
        receivesreceipt: PKNK.receivesreceiptPK.concat(PKNK.receivesreceiptNK),
        processes: PKNK.processesPK.concat(PKNK.processesNK),
        transaction: PKNK.transactionPK.concat(PKNK.transactionNK),
        supply: PKNK.supplyPK.concat(PKNK.supplyNK),
        handles: PKNK.handlesPK.concat(PKNK.handlesNK),
        schedule: PKNK.schedulePK.concat(PKNK.scheduleNK),
        inventory: PKNK.inventoryPK.concat(PKNK.inventoryNK),
        modifies: PKNK.modifiesPK.concat(PKNK.modifiesNK),
        updates: PKNK.updatesPK.concat(PKNK.updatesNK)
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
        employee_net_pay: ["employee_id", "start_date"],
        supplier_product_amt: ["sku"],
        total_pay_view: []
    },
    type: Object = {
        /* Customer */
        membership_id: "INT",
        first_name: "VARCHAR(40)",
        last_name: "VARCHAR(40)",
        address: "VARCHAR(40)",
        phone_number: "VARCHAR(40)",
        join_date: "DATE",

        /* Employee */
        employee_id: "INT",
        // first_name: "VARCHAR(40)",
        // last_name: "VARCHAR(40)",
        sin: "VARCHAR(40)",
        wage: "DECIMAL(19,2)",
        position: "VARCHAR(40)",

        /* Transaction */
        transaction_id: "INT",
        date_transaction: "DATE",
        payment_type: "VARCHAR(40)",
        // employee_id: "INT",

        /* Schedule */
        // employee_id: "INT",
        work_date: "DATE",
        is_holiday: "VARCHAR(40)",
        start_time: "VARCHAR(40)",      //TODO: using DATEDIFF() to compute time between start and end
        end_time: "VARCHAR(40)",

        /* Payroll */
        // employee_id: "INT",
        start_date: "DATE",
        end_date: "DATE",
        hours_worked: "DECIMAL(19,2)",
        deductions: "DECIMAL(19,2)",
        gross_pay: "DECIMAL(19,2)",
        net_pay: "DECIMAL(19,2)",

        /* Transaction */
        // transaction_id: "INT",
        // date_transaction: "DATE",
        // payment_type: "VARCHAR(40)",     // TODO: we said we would be using an enum here?
        // employee_id: "INT",

        /* Product */
        sku: "INT",
        product_name: "VARCHAR(40)",
        cost: "DECIMAL(19,2)",
        days_to_expiry: "INT",

        /* ReceivesReceipt */
        // transaction_id: "INT",
        // sku: "INT",
        // membership_id: "INT",
        quantity: "INT",

        /* Processes */
        // transaction_id: "INT",
        // employee_id: "INT",
        // membership_id: "INT",

        /* Supplier */
        supplier_name: "VARCHAR(40)",
        location: "VARCHAR(40)",
        // phone_number: "VARCHAR(40)",

        /* Supply */
        delivery_id: "INT",
        // sku: "INT",
        // supplier_name: "VARCHAR(40)",
        // location: "VARCHAR(40)",
        delivery_quantity: "INT",
        bulk_cost: "DECIMAL(19,2)",

        /* Inventory */
        // sku: "INT",
        // quantity: "INT",

        /* Handles */
        // employee_id: "INT",
        // sku: "INT",
        // delivery_id: "INT",
        // supplier_name: "VARCHAR(40)",
        // location: "VARCHAR(40)",

        /* Modifies */
        // transaction_id: "INT",
        // sku: "INT",

        /* Updates */
        // supplier_name: "VARCHAR(40)",
        // location: "VARCHAR(40)",
        // delivery_id: "INT",
        // sku: "INT",
    };
