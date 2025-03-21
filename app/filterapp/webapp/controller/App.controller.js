sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("filterapp.controller.App", {
      onInit() {
      }
  });
});

        // onitemscreateSubmit: function () {
        //     var sOrderID=that.getView().byId("idInput").getValue();
        //     var items = sap.ui.getCore().byId("idOrderItemsTable1").getItems();
        //     var orderItems = [];
        //     var validationErrors = [];
        //     var orderData = {
        //         OrderItems: orderItems  
        //     };
        //     items.forEach(function (item) {
        //         var cells = item.getCells();
        //         var itemData = {
        //             ItemID: cells[0].getValue(),
        //             ProductName: cells[1].getValue(),
        //             Quantity: parseInt(cells[2].getValue(), 10),
        //             Price: parseFloat(cells[3].getValue()),
        //             OrderID: sOrderID
        //         };
        //         orderItems.push(itemData);
        //     });

        //     // Convert order data to JSON string
        //     var jsonString = JSON.stringify(orderData);      
        //     var oModel = this.getOwnerComponent().getModel();
        //     // Call the OData function to create the order and items
        //     oModel.callFunction("/Creatingitemsforexistingorderid", {
        //         method: "GET",  
        //         urlParameters: { // Passing the order data (including items) as URL parameters
        //             OrderitemsData: jsonString 
        //         },
        //         success: function (oData) {
        //             sap.m.MessageToast.show(" items created successfully!");
        //             // that.Order_items.close();
        //             that.onitemscreateClose();
        //         },
        //         // error: function (error) {
        //         //     var errorMessage = error.responseText;                    
        //         //     // Extract the specific error message from the response
        //         //     var parsedError = JSON.parse(errorMessage);
        //         //     var message = parsedError.error.message.value;       
        //         //     // Check if the error message contains "Order with ID"
        //         //     if (message && message.includes("Order with ID")) {
        //         //         sap.m.MessageToast.show(message);  // Display the specific error message
        //         //     } else {
        //         //         sap.m.MessageToast.show("Error creating order and items!");
        //         //     }
        //         // }
        //         error: function (error) {
        //             var errorMessage = error.responseText;
        //             var parsedError = JSON.parse(errorMessage);
        //             var message = parsedError.error.message.value;
        //             sap.m.MessageToast.show(message || "Error creating order and items!");
        //         }
        //     });
        // },
 // onMulticreateSubmit: function () {
        //     var sID = sap.ui.getCore().byId("idID").getValue();
        //     var sCustomerName = sap.ui.getCore().byId("idCustomerName").getValue();
        //     var currentDate = new Date();
        
        //     var orderItems = [];
        //     var items = sap.ui.getCore().byId("idOrderItemsTable").getItems();
        
        //     var existingItemIDs = new Set(); // To store backend ItemIDs
        //     var newItemIDs = new Set(); // To store new ItemIDs from form
        //     var validationErrors = [];
        
        //     // Validate Order ID
        //     if (!sID || isNaN(sID)) {
        //         validationErrors.push("Order ID must be a valid number.");
        //     }
        
        //     // Validate Customer Name
        //     if (!sCustomerName || sCustomerName.trim() === "") {
        //         validationErrors.push("Customer Name is required and cannot be empty.");
        //     }
        
        //     var oModel = this.getOwnerComponent().getModel();
        
        //     // **Step 1: Fetch existing OrderItems from the backend**
        //     oModel.read("/OrderItems", {
        //         success: function (oData) {
        //             oData.results.forEach(function (existingItem) {
        //                 existingItemIDs.add(existingItem.ItemID.toString());
        //             });
        
        //             // **Step 2: Validate new Order Items**
        //             items.forEach(function (item, index) {
        //                 var cells = item.getCells();
        //                 var itemID = cells[0].getValue();
        //                 var productName = cells[1].getValue();
        //                 var quantity = cells[2].getValue();
        //                 var price = cells[3].getValue();
        
        //                 if (!itemID || isNaN(itemID)) {
        //                     validationErrors.push(`Row ${index + 1}: Item ID must be a valid number.`);
        //                 } else {
        //                     if (existingItemIDs.has(itemID)) {
        //                         validationErrors.push(`Row ${index + 1}: Item ID '${itemID}' already exists.`);
        //                     } else if (newItemIDs.has(itemID)) {
        //                         validationErrors.push(`Row ${index + 1}: Duplicate Item ID '${itemID}' in form.`);
        //                     } else {
        //                         newItemIDs.add(itemID);
        //                     }
        //                 }
        
        //                 if (!productName || productName.trim() === "") {
        //                     validationErrors.push(`Row ${index + 1}: Product Name is required.`);
        //                 }
        
        //                 if (!quantity || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
        //                     validationErrors.push(`Row ${index + 1}: Quantity must be a valid positive number.`);
        //                 }
        
        //                 if (!price || isNaN(price) || parseFloat(price) <= 0) {
        //                     validationErrors.push(`Row ${index + 1}: Price must be a valid positive number.`);
        //                 }
        
        //                 if (validationErrors.length === 0) {
        //                     orderItems.push({
        //                         ItemID: parseInt(itemID, 10),
        //                         ProductName: productName,
        //                         Quantity: parseInt(quantity, 10),
        //                         Price: parseFloat(price),
        //                         OrderID: sID
        //                     });
        //                 }
        //             });
        
        //             // **Step 3: Show validation errors and stop submission if any exist**
        //             if (validationErrors.length > 0) {
        //                 sap.m.MessageBox.error(validationErrors.join("\n"));
        //                 return;
        //             }
        
        //             // **Step 4: Proceed with order creation if no validation errors**
        //             var orderData = {
        //                 ID: parseInt(sID, 10),
        //                 OrderDate: currentDate,
        //                 CustomerName: sCustomerName,
        //                 OrderItems: orderItems
        //             };
        
        //             var jsonString = JSON.stringify(orderData);     
        //             oModel.callFunction("/orderscreate", {
        //                 method: "GET",
        //                 urlParameters: {
        //                     NewOrdersitemsdetailsData: jsonString
        //                 },
        //                 success: function () {
        //                     sap.m.MessageToast.show("Order and items created successfully!");
        //                     that.Order_items.close();
        //                 },
        //                 error: function (error) {
        //                     var errorMessage = error.responseText;
        //                     var parsedError = JSON.parse(errorMessage);
        //                     var message = parsedError.error.message.value;      
        //                     if (message && message.includes("Order with ID")) {
        //                         sap.m.MessageToast.show(message);
        //                     } else {
        //                         sap.m.MessageToast.show("Error creating order and items!");
        //                     }
        //                 }
        //             });
        //         },
        //         error: function () {
        //             sap.m.MessageBox.error("Failed to fetch existing Order Items. Please try again.");
        //         }
        //     });
        // },
 // onMulticreateSubmit: function () {
    //     var sID = sap.ui.getCore().byId("idID").getValue();
    //     var sCustomerName = sap.ui.getCore().byId("idCustomerName").getValue();
    //     var items = sap.ui.getCore().byId("idOrderItemsTable").getItems();
    //     var currentDate = new Date();
    
    //     var orderItems = [];
    //     var validationErrors = [];
    
    //     // Validate Order ID
    //     if (!sID || isNaN(sID)) {
    //         validationErrors.push("Order ID must be a valid number.");
    //     }
    
    //     // Validate Customer Name
    //     if (!sCustomerName || sCustomerName.trim() === "") {
    //         validationErrors.push("Customer Name is required and cannot be empty.");
    //     }
    
    //     if (validationErrors.length > 0) {
    //         sap.m.MessageBox.error(validationErrors.join("\n"));
    //         return;
    //     }
    
    //     var oModel = this.getOwnerComponent().getModel();
    
    //     // Fetch existing OrderItems from backend and validate new items
    //     oModel.read("/OrderItems", {
    //         success: function (oData) {
    //             var existingItemIDs = new Set(oData.results.map(function (item) {
    //                 return item.ItemID.toString();
    //             }));
    
    //             items.forEach(function (item, index) {
    //                 var cells = item.getCells();
    //                 var itemID = cells[0].getValue();
    //                 var productName = cells[1].getValue();
    //                 var quantity = cells[2].getValue();
    //                 var price = cells[3].getValue();
    
    //                 // Validate Item fields
    //                 if (!itemID || isNaN(itemID) || existingItemIDs.has(itemID)) {
    //                     validationErrors.push(`Row ${index + 1}: Invalid or duplicate Item ID.`);
    //                 }
    //                 if (!productName || productName.trim() === "") {
    //                     validationErrors.push(`Row ${index + 1}: Product Name is required.`);
    //                 }
    //                 if (!quantity || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
    //                     validationErrors.push(`Row ${index + 1}: Quantity must be a valid positive number.`);
    //                 }
    //                 if (!price || isNaN(price) || parseFloat(price) <= 0) {
    //                     validationErrors.push(`Row ${index + 1}: Price must be a valid positive number.`);
    //                 }
    
    //                 // Add valid order items
    //                 if (validationErrors.length === 0) {
    //                     orderItems.push({
    //                         ItemID: parseInt(itemID, 10),
    //                         ProductName: productName,
    //                         Quantity: parseInt(quantity, 10),
    //                         Price: parseFloat(price),
    //                         OrderID: sID
    //                     });
    //                 }
    //             });
    
    //             if (validationErrors.length > 0) {
    //                 sap.m.MessageBox.error(validationErrors.join("\n"));
    //                 return;
    //             }
    
    //             // Proceed with order creation
    //             var orderData = {
    //                 ID: parseInt(sID, 10),
    //                 OrderDate: currentDate,
    //                 CustomerName: sCustomerName,
    //                 OrderItems: orderItems
    //             };
    
    //             var jsonString = JSON.stringify(orderData);
    
    //             oModel.callFunction("/orderscreate", {
    //                 method: "GET",
    //                 urlParameters: { NewOrdersitemsdetailsData: jsonString },
    //                 success: function () {
    //                     sap.m.MessageToast.show("Order and items created successfully!");
    //                     that.Order_items.close();
    //                 },
    //                 error: function (error) {
    //                     var errorMessage = error.responseText;
    //                     var parsedError = JSON.parse(errorMessage);
    //                     var message = parsedError.error.message.value;
    //                     sap.m.MessageToast.show(message || "Error creating order and items!");
    //                 }
    //             });
    //         },
    //         error: function () {
    //             sap.m.MessageBox.error("Failed to fetch existing Order Items. Please try again.");
    //         }
    //     });
    // },

        // onCustomerLiveChange: function (oEvent) {
        //     var sOrderID = oEvent.getParameter("value"); // Get the OrderID entered by the user
        //     var oView = this.getView();
       
        //     if (sOrderID) {
        //         var oModel = this.getOwnerComponent().getModel(); // Get the main model of the app
        //         oModel.callFunction("/filteritems", {
        //             method: "GET",
        //             urlParameters: { OrderID: sOrderID }, // Send OrderID to backend
        //             success: function (oData) {
        //                 var oOrdersitemsModel = new JSONModel(oData.results || []); // Use empty array if no results
        //                 oView.setModel(oOrdersitemsModel, "ordersitemsModel"); // Update table data
        //             },
        //             error: function (err) {
        //                 MessageToast.show("Could not load filtered OrderItems!");
        //                 oView.setModel(new JSONModel([]), "ordersitemsModel"); // Clear the table
        //             }
        //         });
        //     } else {
        //         // If input is empty, clear the table
        //         oView.setModel(new JSONModel([]), "ordersitemsModel");
        //     }
        // }, 


 // //first
        // onMulticreateSubmit: function () {          
        //     // Get values from the form fields
        //     var sID = sap.ui.getCore().byId("idID").getValue();
        //     var sCustomerName = sap.ui.getCore().byId("idCustomerName").getValue();
        //     var currentDate = new Date();
        
        //     // Create the order data object
        //     var orderData = {
        //         ID: sID,
        //         OrderDate: currentDate,
        //         CustomerName: sCustomerName
        //     };
        
        //     // Convert order data to JSON string
        //     var jsonString = JSON.stringify(orderData);      
        //     var oModel = this.getOwnerComponent().getModel();
        //     // Call the OData function to create the order using GET method
        //     oModel.callFunction("/orderscreate", {
        //         method: "GET",  
        //         urlParameters: {
        //             NewOrdersitemsdetailsData: jsonString  // Passing the order data as URL parameters
        //         },
        //         success: function (oData) {
        //             sap.m.MessageToast.show("Order created successfully!");
                   
        //         },
        //         // error: function (error) {
        //         //     if (error.responseText && error.responseText.includes("OrderID already exists")) {
        //         //         sap.m.MessageToast.show("The OrderID already exists. Please choose a different ID.");
        //         //     } else {
        //         //         sap.m.MessageToast.show("Error creating order!");
        //         //     }
        //         // }
        //         error: function (error) {
        //             var errorMessage = error.responseText;                    
        //             // Extract the specific error message from the response
        //             var parsedError = JSON.parse(errorMessage);
        //             var message = parsedError.error.message.value;       
        //             // Check if the error message contains "Order with ID"
        //             if (message && message.includes("Order with ID")) {
        //                 sap.m.MessageToast.show(message);  // Display the specific error message like "Order with ID 1 already exists."
        //             } else {
        //                 sap.m.MessageToast.show("Error creating order!");
        //             }
        //         }
        //     });

  // onUpdateOrder: function (oEvent) {
        //     var oTable = this.byId("itemTable");
        //     if (!oTable) {
        //         MessageToast.show("Table not found.");
        //         return;
        //     }
        
        //     var aSelectedItems = oTable.getSelectedItems();
        //     if (aSelectedItems.length === 0) {
        //         MessageToast.show("Please select at least one item to update.");
        //         return;
        //     }
        
        //     // Create the update fragment only once
        //     if (!this._oMultiUpdateFragment) {
        //         this._oMultiUpdateFragment = sap.ui.xmlfragment("filterapp.fragments.Updatemulti", this);
        //         this.getView().addDependent(this._oMultiUpdateFragment);
        //     }
        
        //     // Retrieve the selected items data
        //     var aItemsToUpdate = [];
        //     aSelectedItems.forEach(function (oItem) {
        //         var oItemData = oItem.getBindingContext("ordersitemsModel").getObject();
        //         aItemsToUpdate.push(oItemData);
        //     });
        
        //     // // Optionally, extract common values like OrderID, CustomerName, OrderDate from one item if they are common
        //     // var orderID = aItemsToUpdate[0].OrderID;
        //     // var customerName = aItemsToUpdate[0].CustomerName;
        //     // var orderDate = aItemsToUpdate[0].OrderDate;
        
        //     // // Set these values in the fragment fields
        //     // var oCustomerNameInput = sap.ui.getCore().byId("idCustomerName1Update1");
        //     // var oOrderIDInput = sap.ui.getCore().byId("idOrderID4Update1");
        //     // var orderdateInput = sap.ui.getCore().byId("idOrderDate1Update1");
        
        //     // oCustomerNameInput.setValue(customerName);
        //     // oOrderIDInput.setValue(orderID);
        //     // orderdateInput.setValue(orderDate);
        
        //     // Set the selected items data to the fragment model for binding
        //     var oUpdateModel = new JSONModel(aItemsToUpdate);
        //     this._oMultiUpdateFragment.setModel(oUpdateModel, "updateModel");
        
        //     // Open the multi-update dialog
        //     this._oMultiUpdateFragment.open();
        // },
        // onUpdateOrder: function (oEvent) {
        //     var oTable = this.byId("itemTable");
        //     if (!oTable) {
        //         MessageToast.show("Table not found.");
        //         return;
        //     }
        
        //     var aSelectedItems = oTable.getSelectedItems();
        //     if (aSelectedItems.length === 0) {
        //         MessageToast.show("Please select at least one item to update.");
        //         return;
        //     }
        
        //     // Create the update fragment only once
        //     if (!this._oMultiUpdateFragment) {
        //         this._oMultiUpdateFragment = sap.ui.xmlfragment("filterapp.fragments.Updatemulti", this);
        //         this.getView().addDependent(this._oMultiUpdateFragment);
        //     }
        
        //     // Retrieve the selected items data
        //     var aItemsToUpdate = aSelectedItems.map(function (oItem) {
        //         return oItem.getBindingContext("ordersitemsModel").getObject();
        //     });
        
        //     // // // Get Order ID from first selected item
        //     // var sOrderID = aItemsToUpdate[0].OrderID_ID;
        //     // var oModel = this.getOwnerComponent().getModel();
        
        //     // // var that = this; 
        
        //     // oModel.callFunction("/RetervingORdersData", {
        //     //     method: "GET",
        //     //     urlParameters: {
        //     //         OrderID: sOrderID
        //     //     },
        //     //     success: function (oData, response) {
        //     //         if (oData.RetervingORdersData) {
        //     //             var orderdata = JSON.parse(oData.RetervingORdersData);
        //     //             var customerName = orderdata[0].CustomerName;
        //     //             var ID = orderdata[0].ID;
        
        //     //             sap.ui.getCore().byId("idCustomerName1Update1").setValue(customerName);
        //     //             sap.ui.getCore().byId("idOrderID4Update1").setValue(ID);
        
        //     //             var oUpdateModel = new JSONModel(aItemsToUpdate);
        //     //             that._oMultiUpdateFragment.setModel(oUpdateModel, "updateModel"); 
        //     //             that._oMultiUpdateFragment.open();
        //     //         }
        //     //     },
        //     //     error: function (oError) {
        //     //         MessageToast.show("Could not load filtered Orderdata!");
        //     //         console.error("Error loading filtered Orderdata:", oError);
        //     //     }
        //     // });
        // //                    var oUpdateModel = new JSONModel(aItemsToUpdate);
        // //                 that._oMultiUpdateFragment.setModel(oUpdateModel, "updateModel"); 
        // //                 that._oMultiUpdateFragment.open();
                    
        // // },
        

        