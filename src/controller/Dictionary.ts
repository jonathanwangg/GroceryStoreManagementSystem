/**
 * Collection of dictionaries for the different Objects.
 */
export default class Dictionary {
    public static PKNK: any = {
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

    public static objects: any = {
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

    public static processTransactions: any = {
        transaction_id: "t.transaction_id",
        date_transaction: "t.date_transaction",
        payment_type: "t.payment_type",
        employee_id: "t.employee_id",
        membership_id: "r.membership_id",
        sku: "r.sku",
        quantity_inventory: "i.quantity",
        quantity_receipt: "r.quantity",
    };

    public static type: any = {
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

    public static populateStr: string =
        "BEGIN\n" +
        "execute immediate 'DROP TABLE Customer CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Employee CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Schedule CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Payroll CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Transaction CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Product CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE ReceivesReceipt CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Processes CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Supplier CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Supply CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Inventory CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Handles CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Modifies CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP TABLE Updates CASCADE CONSTRAINTS';\n" +
        "execute immediate 'DROP VIEW TotalPay';\n" +
        "execute immediate 'CREATE TABLE Customer (\n" +
        "    membership_id INT,\n" +
        "    first_name VARCHAR(40) NOT NULL,\n" +
        "    last_name VARCHAR(40) NOT NULL,\n" +
        "    address VARCHAR(40),\n" +
        "    phone_number VARCHAR(40) NOT NULL,\n" +
        "    join_date DATE NOT NULL,\n" +
        "    PRIMARY KEY(membership_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Employee (\n" +
        "    employee_id INT,\n" +
        "    first_name VARCHAR(40) NOT NULL,\n" +
        "    last_name VARCHAR(40) NOT NULL,\n" +
        "    sin VARCHAR(40) NOT NULL,\n" +
        "    wage DECIMAL(19,2) NOT NULL,\n" +
        "    position VARCHAR(40),\n" +
        "    PRIMARY KEY(employee_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Schedule (\n" +
        "    employee_id INT,\n" +
        "    work_date DATE,\n" +
        "    is_holiday VARCHAR(40) NOT NULL,\n" +
        "    start_time VARCHAR(40),\n" +
        "    end_time VARCHAR(40),\n" +
        "    PRIMARY KEY(employee_id, work_date),\n" +
        "    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Payroll (\n" +
        "    employee_id INT,\n" +
        "    start_date DATE,\n" +
        "    end_date DATE,\n" +
        "    hours_worked DECIMAL(19,2) NOT NULL,\n" +
        "    deductions DECIMAL(19,2),\n" +
        "    gross_pay DECIMAL(19,2),\n" +
        "    net_pay DECIMAL(19,2) NOT NULL,\n" +
        "    PRIMARY KEY(employee_id, start_date, end_date),\n" +
        "    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Transaction (\n" +
        "    transaction_id INT,\n" +
        "    date_transaction DATE NOT NULL,\n" +
        "    payment_type VARCHAR(40) NOT NULL,\n" +
        "    employee_id INT NOT NULL,\n" +
        "    PRIMARY KEY(transaction_id),\n" +
        "    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Product (\n" +
        "    SKU INT,\n" +
        "    product_name VARCHAR(40) NOT NULL,\n" +
        "    cost DECIMAL(19,2) NOT NULL,\n" +
        "    days_to_expiry INT,\n" +
        "    PRIMARY KEY(SKU)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE ReceivesReceipt (\n" +
        "    transaction_id INT,\n" +
        "    SKU INT,\n" +
        "    membership_id INT,\n" +
        "    quantity INT NOT NULL,\n" +
        "    PRIMARY KEY(transaction_id, SKU, membership_id),\n" +
        "    FOREIGN KEY(transaction_id) REFERENCES Transaction(transaction_id),\n" +
        "    FOREIGN KEY(SKU) REFERENCES Product(SKU),\n" +
        "    FOREIGN KEY(membership_id) REFERENCES Customer(membership_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Processes (\n" +
        "    transaction_id INT,\n" +
        "    employee_id INT,\n" +
        "    membership_id INT,\n" +
        "    PRIMARY KEY(transaction_id, employee_id, membership_id),\n" +
        "    FOREIGN KEY(transaction_id) REFERENCES Transaction(transaction_id),\n" +
        "    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),\n" +
        "    FOREIGN KEY(membership_id) REFERENCES Customer(membership_id)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Supplier (\n" +
        "    supplier_name VARCHAR(40),\n" +
        "    location VARCHAR(40),\n" +
        "    phone_number VARCHAR(40),\n" +
        "    PRIMARY KEY(supplier_name,location)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Supply (\n" +
        "    delivery_id INT,\n" +
        "    SKU INT,\n" +
        "    supplier_name VARCHAR(40),\n" +
        "    location VARCHAR(40),\n" +
        "    delivery_quantity INT NOT NULL,\n" +
        "    bulk_cost DECIMAL(19,2) NOT NULL,\n" +
        "    PRIMARY KEY(delivery_id, SKU, supplier_name, location),\n" +
        "    FOREIGN KEY(SKU) REFERENCES Product(SKU),\n" +
        "    FOREIGN KEY(supplier_name, location) REFERENCES Supplier(supplier_name, location)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Inventory (\n" +
        "    SKU INT,\n" +
        "    quantity INT NOT NULL,\n" +
        "    PRIMARY KEY(SKU),\n" +
        "    FOREIGN KEY(SKU) REFERENCES Product(SKU)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Handles (\n" +
        "    employee_id INT,\n" +
        "    SKU INT,\n" +
        "    delivery_id INT,\n" +
        "    supplier_name VARCHAR(40),\n" +
        "    location VARCHAR(40),\n" +
        "    PRIMARY KEY(employee_id, SKU, delivery_id, supplier_name, location),\n" +
        "    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),\n" +
        "    FOREIGN KEY(SKU, delivery_id, supplier_name, location) REFERENCES Supply(SKU, delivery_id, supplier_name, location)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Modifies (\n" +
        "    transaction_id INT,\n" +
        "    SKU INT,\n" +
        "    PRIMARY KEY(transaction_id, SKU),\n" +
        "    FOREIGN KEY(transaction_id) REFERENCES Transaction(transaction_id),\n" +
        "    FOREIGN KEY(SKU) REFERENCES Product(SKU)\n" +
        ")';\n" +
        "execute immediate 'CREATE TABLE Updates (\n" +
        "    supplier_name VARCHAR(40),\n" +
        "    location VARCHAR(40),\n" +
        "    delivery_id INT,\n" +
        "    SKU INT,\n" +
        "    PRIMARY KEY(supplier_name, location, delivery_id, SKU),\n" +
        "    FOREIGN KEY(delivery_id, supplier_name, location, SKU) REFERENCES Supply(delivery_id, supplier_name, location, SKU)\n" +
        ")';\n" +
        "execute immediate 'CREATE VIEW TotalPay AS\n" +
        "SELECT start_date, SUM(net_pay) AS net_pay\n" +
        "FROM Payroll\n" +
        "GROUP BY start_date';\n" +
        "execute immediate 'GRANT SELECT ON Customer TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Employee TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Schedule TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Payroll TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Transaction TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Product TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON ReceivesReceipt TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Processes TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Supplier TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Supply TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Inventory TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Handles TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Modifies TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON Updates TO PUBLIC';\n" +
        "execute immediate 'GRANT SELECT ON TotalPay TO PUBLIC';\n" +
        "commit;" +
        "INSERT INTO Customer VALUES (1,'Francoise','Rautenstrauch','2335 Canton Hwy #6','519-569-8399','2017-10-17');\n" +
        "INSERT INTO Customer VALUES (2,'Kendra','Loud','6 Arch St #9757','506-363-1526','2017-10-17');\n" +
        "INSERT INTO Customer VALUES (3,'Lourdes','Bauswell','9547 Belmont Rd #21','613-903-7043','2017-10-18');\n" +
        "INSERT INTO Customer VALUES (4,'Hannah','Edmison','73 Pittsford Victor Rd','604-334-3686','2017-10-18');\n" +
        "INSERT INTO Customer VALUES (5,'Tom','Loeza','447 Commercial St Se','514-487-6096','2017-10-19');\n" +
        "INSERT INTO Customer VALUES (6,'Queenie','Kramarczyk','47 Garfield Ave','306-421-5793','2017-11-01');\n" +
        "INSERT INTO Customer VALUES (7,'Hui','Portaro','3 Mill Rd','506-827-7755','2017-11-03');\n" +
        "INSERT INTO Customer VALUES (8,'Josefa','Opitz','136 W Grand Ave #3','519-788-7645','2017-11-04');\n" +
        "INSERT INTO Customer VALUES (9,'Lea','Steinhaus','80 Maplewood Dr #34','905-618-8258','2011-11-05');\n" +
        "INSERT INTO Employee VALUES (10,'Bob','Adamson','387-293-234',15.00,'cashier');\n" +
        "INSERT INTO Employee VALUES (20,'Jane','Doe','327-238-238',15.25,'cashier');\n" +
        "INSERT INTO Employee VALUES (30,'First','Last','182-374-286',15.50,'cashier');\n" +
        "INSERT INTO Employee VALUES (40,'Peter','Pan','175-394-368',15.00,'inventory associate');\n" +
        "INSERT INTO Employee VALUES (50,'Dalvir','Khaira','153-726-483',15.50,'inventory associate');\n" +
        "INSERT INTO Employee VALUES (60,'John','Doe','163-476-397',20.00,'supervisor');\n" +
        "INSERT INTO Schedule VALUES (10,'2017-11-13','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (10,'2017-11-14','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (10,'2017-11-15','TRUE','NULL','NULL');\n" +
        "INSERT INTO Schedule VALUES (10,'2017-11-16','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (20,'2017-11-13','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (20,'2017-11-14','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (20,'2017-11-15','TRUE','NULL','NULL');\n" +
        "INSERT INTO Schedule VALUES (20,'2017-11-16','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (30,'2017-11-13','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (30,'2017-11-14','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (30,'2017-11-15','TRUE','NULL','NULL');\n" +
        "INSERT INTO Schedule VALUES (30,'2017-11-16','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (40,'2017-11-13','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (40,'2017-11-14','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (40,'2017-11-15','TRUE','NULL','NULL');\n" +
        "INSERT INTO Schedule VALUES (40,'2017-11-16','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (50,'2017-11-13','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (50,'2017-11-14','FALSE','9:00','15:00');\n" +
        "INSERT INTO Schedule VALUES (50,'2017-11-15','TRUE','NULL','NULL');\n" +
        "INSERT INTO Schedule VALUES (50,'2017-11-16','FALSE','15:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (60,'2017-11-13','FALSE','9:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (60,'2017-11-14','FALSE','9:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (60,'2017-11-15','FALSE','9:00','22:00');\n" +
        "INSERT INTO Schedule VALUES (60,'2017-11-16','TRUE','NULL','NULL');\n" +
        "INSERT INTO Payroll VALUES (10,'2017-10-01','2017-10-14',90,0,1350.00,1323.00);\n" +
        "INSERT INTO Payroll VALUES (20,'2017-10-01','2017-10-14',80,0,1220.00,1195.60);\n" +
        "INSERT INTO Payroll VALUES (30,'2017-10-01','2017-10-14',75,0,1162.50,1139.25);\n" +
        "INSERT INTO Payroll VALUES (40,'2017-10-01','2017-10-14',83,0,1245.00,1220.10);\n" +
        "INSERT INTO Payroll VALUES (50,'2017-10-01','2017-10-14',80,0,1240.00,1215.20);\n" +
        "INSERT INTO Payroll VALUES (60,'2017-10-01','2017-10-14',120,0,2400.00,2352.00);\n" +
        "INSERT INTO Payroll VALUES (10,'2017-10-15','2017-10-28',80,0,1200.00,1176.00);\n" +
        "INSERT INTO Payroll VALUES (20,'2017-10-15','2017-10-28',80,0,1220.00,1195.60);\n" +
        "INSERT INTO Payroll VALUES (30,'2017-10-15','2017-10-28',75,0,1162.50,1139.25);\n" +
        "INSERT INTO Payroll VALUES (40,'2017-10-15','2017-10-28',85,0,1275.00,1249.50);\n" +
        "INSERT INTO Payroll VALUES (50,'2017-10-15','2017-10-28',80,0,1240.00,1215.20);\n" +
        "INSERT INTO Payroll VALUES (60,'2017-10-15','2017-10-28',120,0,2400.00,2352.00);\n" +
        "INSERT INTO Transaction VALUES (11,'2017-11-13','cash',20);\n" +
        "INSERT INTO Transaction VALUES (12,'2017-11-14','credit',10);\n" +
        "INSERT INTO Transaction VALUES (13,'2017-11-15','credit',20);\n" +
        "INSERT INTO Transaction VALUES (14,'2017-11-13','cash',20);\n" +
        "INSERT INTO Transaction VALUES (15,'2017-11-14','cash',10);\n" +
        "INSERT INTO Transaction VALUES (16,'2017-11-16','cash',30);\n" +
        "INSERT INTO Transaction VALUES (17,'2017-11-12','credit',30);\n" +
        "INSERT INTO Transaction VALUES (18,'2017-11-13','credit',30);\n" +
        "INSERT INTO Transaction VALUES (19,'2017-11-13','credit',10);\n" +
        "INSERT INTO Product VALUES (4763,'apple',2.99,30);\n" +
        "INSERT INTO Product VALUES (1238,'carrot',3.49,20);\n" +
        "INSERT INTO Product VALUES (1230,'potato',4.15,10);\n" +
        "INSERT INTO Product VALUES (9788,'egg',10.99,15);\n" +
        "INSERT INTO Product VALUES (6887,'bread',5.49,18);\n" +
        "INSERT INTO Product VALUES (6347,'chicken',10.99,3);\n" +
        "INSERT INTO Product VALUES (1087,'rice',4.99,100);\n" +
        "INSERT INTO Product VALUES (1027,'pumpkin',3.99,120);\n" +
        "INSERT INTO Product VALUES (6888,'pork',9.89,7);\n" +
        "INSERT INTO Product VALUES (9790,'broccoli',4.89,3);\n" +
        "INSERT INTO Product VALUES (6889,'angus beef',20.99,3);\n" +
        "INSERT INTO Product VALUES (9791,'mushroom',3.99,8);\n" +
        "INSERT INTO Product VALUES (6890,'blackberry',4.99,9);\n" +
        "INSERT INTO Product VALUES (9792,'orange',5.99,10);\n" +
        "INSERT INTO Product VALUES (6891,'salmon',15.99,1);\n" +
        "INSERT INTO ReceivesReceipt VALUES (11,4763,2,1);\n" +
        "INSERT INTO ReceivesReceipt VALUES (11,1230,2,5);\n" +
        "INSERT INTO ReceivesReceipt VALUES (12,9788,3,4);\n" +
        "INSERT INTO ReceivesReceipt VALUES (12,6887,3,6);\n" +
        "INSERT INTO ReceivesReceipt VALUES (14,6347,7,2);\n" +
        "INSERT INTO ReceivesReceipt VALUES (15,1087,1,3);\n" +
        "INSERT INTO ReceivesReceipt VALUES (16,1027,3,1);\n" +
        "INSERT INTO ReceivesReceipt VALUES (17,4763,5,2);\n" +
        "INSERT INTO ReceivesReceipt VALUES (17,1238,5,4);\n" +
        "INSERT INTO ReceivesReceipt VALUES (19,1230,4,3);\n" +
        "INSERT INTO ReceivesReceipt VALUES (12,6888,3,7);\n" +
        "INSERT INTO ReceivesReceipt VALUES (11,1238,2,2);\n" +
        "INSERT INTO ReceivesReceipt VALUES (16,1230,3,3);\n" +
        "INSERT INTO ReceivesReceipt VALUES (15,9790,1,1);\n" +
        "INSERT INTO ReceivesReceipt VALUES (17,6889,5,10);\n" +
        "INSERT INTO ReceivesReceipt VALUES (19,1238,4,2);\n" +
        "INSERT INTO ReceivesReceipt VALUES (13,1238,8,3);\n" +
        "INSERT INTO ReceivesReceipt VALUES (12,9791,3,5);\n" +
        "INSERT INTO ReceivesReceipt VALUES (11,6890,2,2);\n" +
        "INSERT INTO ReceivesReceipt VALUES (15,1238,1,4);\n" +
        "INSERT INTO ReceivesReceipt VALUES (14,1230,7,6);\n" +
        "INSERT INTO ReceivesReceipt VALUES (18,9792,9,3);\n" +
        "INSERT INTO ReceivesReceipt VALUES (11,6891,2,7);\n" +
        "INSERT INTO Processes VALUES (11,20,2);\n" +
        "INSERT INTO Processes VALUES (12,10,3);\n" +
        "INSERT INTO Processes VALUES (13,20,8);\n" +
        "INSERT INTO Processes VALUES (14,20,7);\n" +
        "INSERT INTO Processes VALUES (15,10,1);\n" +
        "INSERT INTO Processes VALUES (16,30,3);\n" +
        "INSERT INTO Processes VALUES (17,30,5);\n" +
        "INSERT INTO Processes VALUES (18,30,9);\n" +
        "INSERT INTO Processes VALUES (19,10,4);\n" +
        "INSERT INTO Supplier VALUES ('Benny Foods Ltd','Vancouver','778-384-2837');\n" +
        "INSERT INTO Supplier VALUES ('Vegan Supply','Vancouver','604-582-3847');\n" +
        "INSERT INTO Supplier VALUES ('Mitchell Foods Ltd','Vancouver','604-273-2746');\n" +
        "INSERT INTO Supplier VALUES ('Jonathan''s Grocery','Vancouver','604-293-3479');\n" +
        "INSERT INTO Supplier VALUES ('Dalvir Vegeterian Supply','Vancouver','778-234-3874');\n" +
        "INSERT INTO Supplier VALUES ('Sunny''s Chicken','Richmond','778-593-4939');\n" +
        "INSERT INTO Supplier VALUES ('Canadian Meat Ltd','Richmond','778-927-3346');\n" +
        "INSERT INTO Supplier VALUES ('Richmond Fish Ltd','Richmond','604-238-0384');\n" +
        "INSERT INTO Supply VALUES (1111,4763,'Benny Foods Ltd','Vancouver',1000,249.99);\n" +
        "INSERT INTO Supply VALUES (1112,1238,'Vegan Supply','Vancouver',900,298.99);\n" +
        "INSERT INTO Supply VALUES (1112,1230,'Vegan Supply','Vancouver',500,399.00);\n" +
        "INSERT INTO Supply VALUES (1113,9788,'Sunny''s Chicken','Richmond',200,49.90);\n" +
        "INSERT INTO Supply VALUES (1114,6887,'Mitchell Foods Ltd','Vancouver',20,10.00);\n" +
        "INSERT INTO Supply VALUES (1114,6347,'Mitchell Foods Ltd','Vancouver',100,50.00);\n" +
        "INSERT INTO Supply VALUES (1115,1087,'Jonathan''s Grocery','Vancouver',500,49.99);\n" +
        "INSERT INTO Supply VALUES (1115,1027,'Jonathan''s Grocery','Vancouver',200,19.99);\n" +
        "INSERT INTO Supply VALUES (1114,6888,'Mitchell Foods Ltd','Vancouver',1000,49.99);\n" +
        "INSERT INTO Supply VALUES (1116,9790,'Dalvir Vegeterian Supply','Vancouver',300,28.99);\n" +
        "INSERT INTO Supply VALUES (1114,6889,'Canadian Meat Ltd','Richmond',400,25.99);\n" +
        "INSERT INTO Supply VALUES (1116,9791,'Dalvir Vegeterian Supply','Vancouver',500,30.99);\n" +
        "INSERT INTO Supply VALUES (1114,6890,'Mitchell Foods Ltd','Vancouver',1000,249.99);\n" +
        "INSERT INTO Supply VALUES (1116,9792,'Dalvir Vegeterian Supply','Vancouver',200,20.99);\n" +
        "INSERT INTO Supply VALUES (1117,6891,'Richmond Fish Ltd','Richmond',80,10.99);\n" +
        "INSERT INTO Handles VALUES (40,4763,1111,'Benny Foods Ltd','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,1238,1112,'Vegan Supply','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,1230,1112,'Vegan Supply','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,9788,1113,'Sunny''s Chicken','Richmond');\n" +
        "INSERT INTO Handles VALUES (40,6887,1114,'Mitchell Foods Ltd','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,6347,1114,'Mitchell Foods Ltd','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,1087,1115,'Jonathan''s Grocery','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,1027,1115,'Jonathan''s Grocery','Vancouver');\n" +
        "INSERT INTO Handles VALUES (40,6888,1114,'Mitchell Foods Ltd','Vancouver');\n" +
        "INSERT INTO Handles VALUES (50,9790,1116,'Dalvir Vegeterian Supply','Vancouver');\n" +
        "INSERT INTO Handles VALUES (50,6889,1114,'Canadian Meat Ltd','Richmond');\n" +
        "INSERT INTO Handles VALUES (50,9791,1116,'Dalvir Vegeterian Supply','Vancouver');\n" +
        "INSERT INTO Handles VALUES (50,6890,1114,'Mitchell Foods Ltd','Vancouver');\n" +
        "INSERT INTO Handles VALUES (50,9792,1116,'Dalvir Vegeterian Supply','Vancouver');\n" +
        "INSERT INTO Handles VALUES (50,6891,1117,'Richmond Fish Ltd','Richmond');\n" +
        "INSERT INTO Inventory VALUES (4763,800);\n" +
        "INSERT INTO Inventory VALUES (1238,500);\n" +
        "INSERT INTO Inventory VALUES (1230,300);\n" +
        "INSERT INTO Inventory VALUES (9788,100);\n" +
        "INSERT INTO Inventory VALUES (6887,19);\n" +
        "INSERT INTO Inventory VALUES (6347,50);\n" +
        "INSERT INTO Inventory VALUES (1087,450);\n" +
        "INSERT INTO Inventory VALUES (1027,180);\n" +
        "INSERT INTO Inventory VALUES (6888,200);\n" +
        "INSERT INTO Inventory VALUES (9790,100);\n" +
        "INSERT INTO Inventory VALUES (6889,80);\n" +
        "INSERT INTO Inventory VALUES (9791,320);\n" +
        "INSERT INTO Inventory VALUES (6890,90);\n" +
        "INSERT INTO Inventory VALUES (9792,10);\n" +
        "INSERT INTO Inventory VALUES (6891,5);\n" +
        "INSERT INTO Modifies VALUES (11,4763);\n" +
        "INSERT INTO Modifies VALUES (11,1238);\n" +
        "INSERT INTO Modifies VALUES (11,1230);\n" +
        "INSERT INTO Modifies VALUES (12,9788);\n" +
        "INSERT INTO Modifies VALUES (12,6887);\n" +
        "INSERT INTO Modifies VALUES (14,6347);\n" +
        "INSERT INTO Modifies VALUES (15,1087);\n" +
        "INSERT INTO Modifies VALUES (16,1027);\n" +
        "INSERT INTO Modifies VALUES (17,4763);\n" +
        "INSERT INTO Modifies VALUES (17,1238);\n" +
        "INSERT INTO Modifies VALUES (19,1230);\n" +
        "INSERT INTO Modifies VALUES (12,6888);\n" +
        "INSERT INTO Modifies VALUES (16,1230);\n" +
        "INSERT INTO Modifies VALUES (15,9790);\n" +
        "INSERT INTO Modifies VALUES (17,6889);\n" +
        "INSERT INTO Modifies VALUES (19,1238);\n" +
        "INSERT INTO Modifies VALUES (13,1238);\n" +
        "INSERT INTO Modifies VALUES (12,9791);\n" +
        "INSERT INTO Modifies VALUES (11,6890);\n" +
        "INSERT INTO Modifies VALUES (15,1238);\n" +
        "INSERT INTO Modifies VALUES (14,1230);\n" +
        "INSERT INTO Modifies VALUES (18,9792);\n" +
        "INSERT INTO Modifies VALUES (11,6891);\n" +
        "END;"
}
