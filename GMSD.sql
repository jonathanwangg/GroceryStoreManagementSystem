drop table  CUSTOMER           cascade constraints;
drop table  EMPLOYEE           cascade constraints;
drop table  SCHEDULE           cascade constraints;
drop table  PAYROLL            cascade constraints;
drop table  TRANSACTION        cascade constraints;
drop table  PRODUCT            cascade constraints;
drop table  RECEIVESRECEIPT    cascade constraints;
drop table  PROCESSES          cascade constraints;
drop table  Supplier          cascade constraints;
drop table  SUPPLY             cascade constraints;
drop table  INVENTORY          cascade constraints;
drop table  HANDLES            cascade constraints;
drop table  MODIFIES           cascade constraints;
drop table  UPDATES            cascade constraints;

CREATE TABLE Customer (
    membership_id INT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    address VARCHAR(40) NOT NULL,
    phone_number VARCHAR(40) NOT NULL,
    join_date DATE NOT NULL,
    PRIMARY KEY(membership_id)
);
grant select on Customer to public;

CREATE TABLE Employee (
    employee_id INT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    sin VARCHAR(40) NOT NULL,
    wage FLOAT NOT NULL,
    position VARCHAR(40) CHECK(position IN ('cashier', 'inventory associate', 'supervisor')),
    PRIMARY KEY(employee_id)
);

grant select on Employee to public;


CREATE TABLE Schedule (
    employee_id INT NOT NULL,
    work_date DATE NOT NULL,
    is_holiday VARCHAR(40) NOT NULL,
    start_time VARCHAR(40),
    end_time VARCHAR(40),
    PRIMARY KEY(employee_id, work_date),
    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id)
);
grant select on Schedule to public;

CREATE TABLE Payroll (
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    hours_worked INT NOT NULL,
    deductions INT,
    gross_pay FLOAT NOT NULL,
    net_pay FLOAT NOT NULL,
    PRIMARY KEY(employee_id, start_date, end_date),
    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id)
);
grant select on Payroll to public;

CREATE TABLE Transaction (
    transaction_id INT NOT NULL,
    date_transaction DATE NOT NULL,
    payment_type VARCHAR(40) NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY(transaction_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);
grant select on Transaction to public;

CREATE TABLE Product (
    SKU INT NOT NULL,
    product_name VARCHAR(40) NOT NULL,
    cost FLOAT NOT NULL,
    days_to_expiry INT NOT NULL,
    PRIMARY KEY(SKU)
);
grant select on Product to public;


CREATE TABLE ReceivesReceipt (
    transaction_id INT NOT NULL,
    SKU INT NOT NULL,
    membership_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(transaction_id, SKU, membership_id),
    FOREIGN KEY(transaction_id) REFERENCES Transaction(transaction_id),
    FOREIGN KEY(SKU) REFERENCES Product(SKU),
    FOREIGN KEY(membership_id) REFERENCES Customer(membership_id)
);
grant select on ReceivesReceipt to public;


CREATE TABLE Processes (
    transaction_id INT NOT NULL,
    employee_id INT NOT NULL,
    membership_id INT NOT NULL,
    PRIMARY KEY(transaction_id, employee_id, membership_id),
    FOREIGN KEY(transaction_id) REFERENCES Transaction(transaction_id),
    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY(membership_id) REFERENCES Customer(membership_id)
);
grant select on Processes to public;



CREATE TABLE Supplier (
    supplier_name VARCHAR(40) NOT NULL,
    location VARCHAR(40) NOT NULL,
    phone_number VARCHAR(40) NOT NULL,
    PRIMARY KEY(supplier_name,location)
);
grant select on Supplier to public;


CREATE TABLE Supply (
    delivery_id INT,
    SKU INT,
    supplier_name VARCHAR(40),
    location VARCHAR(40),
    delivery_quantity INT,
    bulk_cost float,
    PRIMARY KEY(delivery_id, SKU, supplier_name, location),
    FOREIGN KEY(SKU) REFERENCES Product(SKU),
    FOREIGN KEY(supplier_name, location) REFERENCES Supplier(supplier_name, location)
);
grant select on Supply to public;

CREATE TABLE Inventory (
    SKU INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(SKU),
    FOREIGN KEY(SKU) REFERENCES Product(SKU)
);
grant select on Inventory to public;  

CREATE TABLE Handles (
    employee_id INT NOT NULL,
    SKU INT NOT NULL,
    delivery_id INT NOT NULL,
    supplier_name VARCHAR(40) NOT NULL,
    location VARCHAR(40) NOT NULL,
    PRIMARY KEY(employee_id, SKU, delivery_id, supplier_name, location),
    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY(SKU, delivery_id, supplier_name, location) REFERENCES Supply(SKU, delivery_id, supplier_name, location)
);
grant select on Handles to public;

CREATE TABLE Modifies (
    transaction_id INT NOT NULL,
    SKU INT NOT NULL,
    PRIMARY KEY(transaction_id, SKU),
    FOREIGN KEY(transaction_id) REFERENCES Transaction(transaction_id),
    FOREIGN KEY(SKU) REFERENCES Product(SKU)
);
grant select on Modifies to public;


CREATE TABLE Updates (
    supplier_name VARCHAR(40) NOT NULL,
    location VARCHAR(40) NOT NULL,
    delivery_id INT NOT NULL,
    SKU INT NOT NULL,
    PRIMARY KEY(supplier_name, location, delivery_id, SKU),
    FOREIGN KEY(delivery_id, supplier_name, location, SKU) REFERENCES Supply(delivery_id, supplier_name, location, SKU)
);

grant select on Updates to public;

commit;

INSERT INTO Customer VALUES (1,'Francoise','Rautenstrauch','2335 Canton Hwy #6','519-569-8399','2017-10-17');
INSERT INTO Customer VALUES (2,'Kendra','Loud','6 Arch St #9757','506-363-1526','2017-10-17');
INSERT INTO Customer VALUES (3,'Lourdes','Bauswell','9547 Belmont Rd #21','613-903-7043','2017-10-18');
INSERT INTO Customer VALUES (4,'Hannah','Edmison','73 Pittsford Victor Rd','604-334-3686','2017-10-18');
INSERT INTO Customer VALUES (5,'Tom','Loeza','447 Commercial St Se','514-487-6096','2017-10-19');
INSERT INTO Customer VALUES (6,'Queenie','Kramarczyk','47 Garfield Ave','306-421-5793','2017-11-01');
INSERT INTO Customer VALUES (7,'Hui','Portaro','3 Mill Rd','506-827-7755','2017-11-03');
INSERT INTO Customer VALUES (8,'Josefa','Opitz','136 W Grand Ave #3','519-788-7645','2017-11-04');
INSERT INTO Customer VALUES (9,'Lea','Steinhaus','80 Maplewood Dr #34','905-618-8258','2011-11-05');


commit;

INSERT INTO Employee VALUES (10,'Bob','Adamson','387-293-234',15.00,'cashier');
INSERT INTO Employee VALUES (20,'Jane','Doe','327-238-238',15.25,'cashier');
INSERT INTO Employee VALUES (30,'First','Last','182-374-286',15.50,'cashier');
INSERT INTO Employee VALUES (40,'Peter','Pan','175-394-368',15.00,'inventory associate');
INSERT INTO Employee VALUES (50,'Dalvir','Khaira','153-726-483',15.50,'inventory associate');
INSERT INTO Employee VALUES (60,'John','Doe','163-476-397',20.00,'supervisor');

commit;

INSERT INTO Schedule VALUES (10,'2017-11-13','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (10,'2017-11-14','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (10,'2017-11-15','TRUE','NULL','NULL');
INSERT INTO Schedule VALUES (10,'2017-11-16','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (20,'2017-11-13','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (20,'2017-11-14','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (20,'2017-11-15','TRUE','NULL','NULL');
INSERT INTO Schedule VALUES (20,'2017-11-16','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (30,'2017-11-13','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (30,'2017-11-14','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (30,'2017-11-15','TRUE','NULL','NULL');
INSERT INTO Schedule VALUES (30,'2017-11-16','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (40,'2017-11-13','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (40,'2017-11-14','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (40,'2017-11-15','TRUE','NULL','NULL');
INSERT INTO Schedule VALUES (40,'2017-11-16','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (50,'2017-11-13','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (50,'2017-11-14','FALSE','9:00','15:00');
INSERT INTO Schedule VALUES (50,'2017-11-15','TRUE','NULL','NULL');
INSERT INTO Schedule VALUES (50,'2017-11-16','FALSE','15:00','22:00');
INSERT INTO Schedule VALUES (60,'2017-11-13','FALSE','9:00','22:00');
INSERT INTO Schedule VALUES (60,'2017-11-14','FALSE','9:00','22:00');
INSERT INTO Schedule VALUES (60,'2017-11-15','FALSE','9:00','22:00');
INSERT INTO Schedule VALUES (60,'2017-11-16','TRUE','NULL','NULL');

commit;

INSERT INTO Payroll VALUES (10,'2017-10-01','2017-10-14',90,0,1350.00,1323.00);
INSERT INTO Payroll VALUES (20,'2017-10-01','2017-10-14',80,0,1220.00,1195.60);
INSERT INTO Payroll VALUES (30,'2017-10-01','2017-10-14',75,0,1162.50,1139.25);
INSERT INTO Payroll VALUES (40,'2017-10-01','2017-10-14',83,0,1245.00,1220.10);
INSERT INTO Payroll VALUES (50,'2017-10-01','2017-10-14',80,0,1240.00,1215.20);
INSERT INTO Payroll VALUES (60,'2017-10-01','2017-10-14',120,0,2400.00,2352.00);
INSERT INTO Payroll VALUES (10,'2017-10-15','2017-10-28',80,0,1200.00,1176.00);
INSERT INTO Payroll VALUES (20,'2017-10-15','2017-10-28',80,0,1220.00,1195.60);
INSERT INTO Payroll VALUES (30,'2017-10-15','2017-10-28',75,0,1162.50,1139.25);
INSERT INTO Payroll VALUES (40,'2017-10-15','2017-10-28',85,0,1275.00,1249.50);
INSERT INTO Payroll VALUES (50,'2017-10-15','2017-10-28',80,0,1240.00,1215.20);
INSERT INTO Payroll VALUES (60,'2017-10-15','2017-10-28',120,0,2400.00,2352.00);

commit;

INSERT INTO Transaction VALUES (11,'2017-11-13','cash',20);
INSERT INTO Transaction VALUES (12,'2017-11-14','credit',10);
INSERT INTO Transaction VALUES (13,'2017-11-15','credit',20);
INSERT INTO Transaction VALUES (14,'2017-11-13','cash',20);
INSERT INTO Transaction VALUES (15,'2017-11-14','cash',10);
INSERT INTO Transaction VALUES (16,'2017-11-16','cash',30);
INSERT INTO Transaction VALUES (17,'2017-11-12','credit',30);
INSERT INTO Transaction VALUES (18,'2017-11-13','credit',30);
INSERT INTO Transaction VALUES (19,'2017-11-13','credit',10);

commit;

INSERT INTO Product VALUES (4763,'apple',2.99,30);
INSERT INTO Product VALUES (1238,'carrot',3.49,20);
INSERT INTO Product VALUES (1230,'potato',4.15,10);
INSERT INTO Product VALUES (9788,'egg',10.99,15);
INSERT INTO Product VALUES (6887,'bread',5.49,18);
INSERT INTO Product VALUES (6347,'chicken',10.99,3);
INSERT INTO Product VALUES (1087,'rice',4.99,100);
INSERT INTO Product VALUES (1027,'pumpkin',3.99,120);
INSERT INTO Product VALUES (6888,'pork',9.89,7);
INSERT INTO Product VALUES (9790,'broccoli',4.89,3);
INSERT INTO Product VALUES (6889,'angus beef',20.99,3);
INSERT INTO Product VALUES (9791,'mushroom',3.99,8);
INSERT INTO Product VALUES (6890,'blackberry',4.99,9);
INSERT INTO Product VALUES (9792,'orange',5.99,10);
INSERT INTO Product VALUES (6891,'salmon',15.99,1);

commit;

INSERT INTO ReceivesReceipt VALUES (11,4763,2,1);
INSERT INTO ReceivesReceipt VALUES (11,1230,2,5);
INSERT INTO ReceivesReceipt VALUES (12,9788,3,4);
INSERT INTO ReceivesReceipt VALUES (12,6887,3,6);
INSERT INTO ReceivesReceipt VALUES (14,6347,7,2);
INSERT INTO ReceivesReceipt VALUES (15,1087,1,3);
INSERT INTO ReceivesReceipt VALUES (16,1027,3,1);
INSERT INTO ReceivesReceipt VALUES (17,4763,5,2);
INSERT INTO ReceivesReceipt VALUES (17,1238,5,4);
INSERT INTO ReceivesReceipt VALUES (19,1230,4,3);
INSERT INTO ReceivesReceipt VALUES (12,6888,3,7);
INSERT INTO ReceivesReceipt VALUES (11,1238,2,2);
INSERT INTO ReceivesReceipt VALUES (16,1230,3,3);
INSERT INTO ReceivesReceipt VALUES (15,9790,1,1);
INSERT INTO ReceivesReceipt VALUES (17,6889,5,10);
INSERT INTO ReceivesReceipt VALUES (19,1238,4,2);
INSERT INTO ReceivesReceipt VALUES (13,1238,8,3);
INSERT INTO ReceivesReceipt VALUES (12,9791,3,5);
INSERT INTO ReceivesReceipt VALUES (11,6890,2,2);
INSERT INTO ReceivesReceipt VALUES (15,1238,1,4);
INSERT INTO ReceivesReceipt VALUES (14,1230,7,6);
INSERT INTO ReceivesReceipt VALUES (18,9792,9,3);
INSERT INTO ReceivesReceipt VALUES (11,6891,2,7);

commit;

INSERT INTO Processes VALUES (11,20,2);
INSERT INTO Processes VALUES (12,10,3);
INSERT INTO Processes VALUES (13,20,8);
INSERT INTO Processes VALUES (14,20,7);
INSERT INTO Processes VALUES (15,10,1);
INSERT INTO Processes VALUES (16,30,3);
INSERT INTO Processes VALUES (17,30,5);
INSERT INTO Processes VALUES (18,30,9);
INSERT INTO Processes VALUES (19,10,4);

commit;

INSERT INTO Supplier VALUES ('Benny Foods Ltd','Vancouver','778-384-2837');
INSERT INTO Supplier VALUES ('Vegan Supply','Vancouver','604-582-3847');
INSERT INTO Supplier VALUES ('Mitchell Foods Ltd','Vancouver','604-273-2746');
INSERT INTO Supplier VALUES ('Jonathan''s Grocery','Vancouver','604-293-3479');
INSERT INTO Supplier VALUES ('Dalvir Vegeterian Supply','Vancouver','778-234-3874');
INSERT INTO Supplier VALUES ('Sunny''s Chicken','Richmond','778-593-4939');
INSERT INTO Supplier VALUES ('Canadian Meat Ltd','Richmond','778-927-3346');
INSERT INTO Supplier VALUES ('Richmond Fish Ltd','Richmond','604-238-0384');

commit;

INSERT INTO Supply VALUES (1111,4763,'Benny Foods Ltd','Vancouver',1000,249.99);
INSERT INTO Supply VALUES (1112,1238,'Vegan Supply','Vancouver',900,298.99);
INSERT INTO Supply VALUES (1112,1230,'Vegan Supply','Vancouver',500,399.00);
INSERT INTO Supply VALUES (1113,9788,'Sunny''s Chicken','Richmond',200,49.90);
INSERT INTO Supply VALUES (1114,6887,'Mitchell Foods Ltd','Vancouver',20,10.00);
INSERT INTO Supply VALUES (1114,6347,'Mitchell Foods Ltd','Vancouver',100,50.00);
INSERT INTO Supply VALUES (1115,1087,'Jonathan''s Grocery','Vancouver',500,49.99);
INSERT INTO Supply VALUES (1115,1027,'Jonathan''s Grocery','Vancouver',200,19.99);
INSERT INTO Supply VALUES (1114,6888,'Mitchell Foods Ltd','Vancouver',1000,49.99);
INSERT INTO Supply VALUES (1116,9790,'Dalvir Vegeterian Supply','Vancouver',300,28.99);
INSERT INTO Supply VALUES (1114,6889,'Canadian Meat Ltd','Richmond',400,25.99);
INSERT INTO Supply VALUES (1116,9791,'Dalvir Vegeterian Supply','Vancouver',500,30.99);
INSERT INTO Supply VALUES (1114,6890,'Mitchell Foods Ltd','Vancouver',1000,249.99);
INSERT INTO Supply VALUES (1116,9792,'Dalvir Vegeterian Supply','Vancouver',200,20.99);
INSERT INTO Supply VALUES (1117,6891,'Richmond Fish Ltd','Richmond',80,10.99);

commit;

INSERT INTO Handles VALUES (40,4763,1111,'Benny Foods Ltd','Vancouver');
INSERT INTO Handles VALUES (40,1238,1112,'Vegan Supply','Vancouver');
INSERT INTO Handles VALUES (40,1230,1112,'Vegan Supply','Vancouver');
INSERT INTO Handles VALUES (40,9788,1113,'Sunny''s Chicken','Richmond');
INSERT INTO Handles VALUES (40,6887,1114,'Mitchell Foods Ltd','Vancouver');
INSERT INTO Handles VALUES (40,6347,1114,'Mitchell Foods Ltd','Vancouver');
INSERT INTO Handles VALUES (40,1087,1115,'Jonathan''s Grocery','Vancouver');
INSERT INTO Handles VALUES (40,1027,1115,'Jonathan''s Grocery','Vancouver');
INSERT INTO Handles VALUES (40,6888,1114,'Mitchell Foods Ltd','Vancouver');
INSERT INTO Handles VALUES (50,9790,1116,'Dalvir Vegeterian Supply','Vancouver');
INSERT INTO Handles VALUES (50,6889,1114,'Canadian Meat Ltd','Richmond');
INSERT INTO Handles VALUES (50,9791,1116,'Dalvir Vegeterian Supply','Vancouver');
INSERT INTO Handles VALUES (50,6890,1114,'Mitchell Foods Ltd','Vancouver');
INSERT INTO Handles VALUES (50,9792,1116,'Dalvir Vegeterian Supply','Vancouver');
INSERT INTO Handles VALUES (50,6891,1117,'Richmond Fish Ltd','Richmond');

commit;


INSERT INTO Inventory VALUES (4763,800);
INSERT INTO Inventory VALUES (1238,500);
INSERT INTO Inventory VALUES (1230,300);
INSERT INTO Inventory VALUES (9788,100);
INSERT INTO Inventory VALUES (6887,19);
INSERT INTO Inventory VALUES (6347,50);
INSERT INTO Inventory VALUES (1087,450);
INSERT INTO Inventory VALUES (1027,180);
INSERT INTO Inventory VALUES (6888,200);
INSERT INTO Inventory VALUES (9790,100);
INSERT INTO Inventory VALUES (6889,80);
INSERT INTO Inventory VALUES (9791,320);
INSERT INTO Inventory VALUES (6890,90);
INSERT INTO Inventory VALUES (9792,10);
INSERT INTO Inventory VALUES (6891,5);

commit;

INSERT INTO Modifies VALUES (11,4763);
INSERT INTO Modifies VALUES (11,1238);
INSERT INTO Modifies VALUES (11,1230);
INSERT INTO Modifies VALUES (12,9788);
INSERT INTO Modifies VALUES (12,6887);
INSERT INTO Modifies VALUES (14,6347);
INSERT INTO Modifies VALUES (15,1087);
INSERT INTO Modifies VALUES (16,1027);
INSERT INTO Modifies VALUES (17,4763);
INSERT INTO Modifies VALUES (17,1238);
INSERT INTO Modifies VALUES (19,1230);
INSERT INTO Modifies VALUES (12,6888);
INSERT INTO Modifies VALUES (16,1230);
INSERT INTO Modifies VALUES (15,9790);
INSERT INTO Modifies VALUES (17,6889);
INSERT INTO Modifies VALUES (19,1238);
INSERT INTO Modifies VALUES (13,1238);
INSERT INTO Modifies VALUES (12,9791);
INSERT INTO Modifies VALUES (11,6890);
INSERT INTO Modifies VALUES (15,1238);
INSERT INTO Modifies VALUES (14,1230);
INSERT INTO Modifies VALUES (18,9792);
INSERT INTO Modifies VALUES (11,6891);

commit;
