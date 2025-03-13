sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageToast, Filter, FilterOperator) {
    "use strict";
    var that;
    return Controller.extend("filterapp.controller.View1", {

        onInit: function () {
            that = this;
            that.valuehelper();
        },
        OnOrderandItems:function(){
            if (!that.Order_items) {
                that.Order_items = sap.ui.xmlfragment("filterapp.fragments.Multicreate", that);
                that.getView().addDependent(that.Order_items); 
            }
            that.Order_items.open();
        },
        onMulticreateClose:function(){
       that.Order_items.close();
        },
        onHandleValueHelp: function (oEvent) {
            // var oView = this.getView();
            that._sInputId = oEvent.getSource().getId(); // Store the input field ID for later use
            if (!that.valuehelperDialog) {
                that.valuehelperDialog = sap.ui.xmlfragment("filterapp.fragments.filterbackend", that);
                that.getView().addDependent(that.valuehelperDialog); 
            }
            that.valuehelperDialog.open();
            // Bind the model to the dialog and fetch the Orders data if not done yet
            if (!that.valueModel) {
                that.valueModel = new JSONModel(); 
                that.valuehelperDialog.setModel(that.valueModel, "valuehelpmodel");
            }
            this.valuehelper();
        },
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
        // },
    //    //second
        onMulticreateSubmit: function () {
            // Get values from the form fields
            var sID = sap.ui.getCore().byId("idID").getValue();
            var sCustomerName = sap.ui.getCore().byId("idCustomerName").getValue();
            var currentDate = new Date();
        
            // Get the order items from the table
            var orderItems = [];
            
            var items = sap.ui.getCore().byId("idOrderItemsTable").getItems();
        
            items.forEach(function (item) {
                var cells = item.getCells();
                var itemData = {
                    ItemID: cells[0].getValue(),
                    ProductName: cells[1].getValue(),
                    Quantity: parseInt(cells[2].getValue(), 10),
                    Price: parseFloat(cells[3].getValue()),
                    OrderID: sID
                };
                orderItems.push(itemData);
            });
        
            // Create the order data object
            var orderData = {
                ID: sID,
                OrderDate: currentDate,
                CustomerName: sCustomerName,
                OrderItems: orderItems  // Include the order items in the request
            };
        
            // Convert order data to JSON string
            var jsonString = JSON.stringify(orderData);      
            var oModel = this.getOwnerComponent().getModel();
        
            // Call the OData function to create the order and items
            oModel.callFunction("/orderscreate", {
                method: "GET",  
                urlParameters: {
                    NewOrdersitemsdetailsData: jsonString  // Passing the order data (including items) as URL parameters
                },
                success: function (oData) {
                    sap.m.MessageToast.show("Order and items created successfully!");
                },
                error: function (error) {
                    var errorMessage = error.responseText;                    
                    // Extract the specific error message from the response
                    var parsedError = JSON.parse(errorMessage);
                    var message = parsedError.error.message.value;       
        
                    // Check if the error message contains "Order with ID"
                    if (message && message.includes("Order with ID")) {
                        sap.m.MessageToast.show(message);  // Display the specific error message like "Order with ID 1 already exists."
                    } else {
                        sap.m.MessageToast.show("Error creating order and items!");
                    }
                }
            });
        },
        
       
        
        
        
        
        valuehelper: function () {
            var oData = this.getOwnerComponent().getModel(); 
            oData.read("/Order", {
                success: function (oData, oResponse) {
                    if (that.valueModel) {
                        that.valueModel.setData(oData.results);
                    }
                },
                error: function (oError) {
                    MessageToast.show("Could not load Orders data!");
                    console.error("Error loading Orders:", oError);
                }
            });
        },
        
        onValueHelpDialogConfirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sOrderID = oSelectedItem.getTitle();
                // Find the corresponding input field and set the selected value (Order ID)// Use stored input ID
                var oInput = this.getView().byId(this._sInputId); 
                oInput.setValue(sOrderID); // Set the selected OrderID into the input field
            }
        },
      
        onValueHelpDialogConfirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sOrderID = oSelectedItem.getTitle();
                var oInput = this.getView().byId(this._sInputId); 
                oInput.setValue(sOrderID);
                var oModel = this.getOwnerComponent().getModel();       
                oModel.callFunction("/filteritems", {
                    method: "GET",
                    urlParameters: {
                        OrderID: sOrderID
                    },
                    success: function (oData, response) {
                        // Check if we have valid data in oData
                        if (oData.results && oData.results.length > 0) {
                            var oOrdersitemsModel = new JSONModel(oData.results);  // Use results directly
                            that.getView().setModel(oOrdersitemsModel, "ordersitemsModel");       
                        } else {
                            MessageToast.show("No order items found for the selected OrderID.");
                        }
                    },
                    error: function (oError) {
                        MessageToast.show("Could not load filtered OrderItems!");
                        console.error("Error loading filtered OrderItems:", oError);
                    }
                });
            }
        },
         
        onCustomerLiveChange: function (oEvent) {
            var sOrderID = oEvent.getParameter("value"); 
            var oView = this.getView();
        
            if (sOrderID) {
                var oModel = this.getOwnerComponent().getModel(); 
                oModel.callFunction("/filteritems", {
                    method: "GET",
                    urlParameters: { OrderID: sOrderID }, // Send OrderID to backend
                    success: function (oData) {
                        // Get the results array, or an empty array if no results
                        var aResults = oData.results || []; 
                        if (aResults.length === 0) {
                            MessageToast.show("No records found for the given OrderID."); 
                        } // Use the results (or empty array if no results)
                        var oOrdersitemsModel = new JSONModel(aResults);
                        oView.setModel(oOrdersitemsModel, "ordersitemsModel"); 
                    },
                    error: function (err) {
                        MessageToast.show("Could not load filtered OrderItems!");
                        oView.setModel(new JSONModel([]), "ordersitemsModel");
                    }
                });
            } else {
                // If input is empty, clear the table
                oView.setModel(new JSONModel([]), "ordersitemsModel");
            }
        },
           
        _handleLiveChange: function(oEvent) {
            var sQuery = oEvent.getParameter("value");          
            if (sQuery) {              
                var oBinding = oEvent.getSource().getBinding("items");               
                // Create filters for both the title (ID) and description (CustomerName) fields
                var oFilterTitle = new Filter({
                    path: "ID",
                    operator: FilterOperator.StartsWith, 
                    value1: sQuery.toLowerCase() 
                });               
                var oFilterDescription = new Filter({
                    path: "CustomerName", 
                    operator: FilterOperator.StartsWith, 
                    value1: sQuery.toLowerCase() 
                });               
                // Combine both filters using OR operator
                var oCombinedFilter = new Filter({
                    filters: [oFilterTitle, oFilterDescription], 
                    operator: FilterOperator.Or 
                });               
                oBinding.filter([oCombinedFilter]);
            } else {
                // If the search term is empty, clear the filter
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]); 
            }
        },
        onAddRow: function () {
            var oTable = sap.ui.getCore().byId("idOrderItemsTable");
            var oItem = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Input({
                        value: "",
                        type: sap.m.InputType.Number
                    }),
                    new sap.m.Input({
                        value: ""
                    }),
                    new sap.m.Input({
                        value: "",
                        type: sap.m.InputType.Number
                    }),
                    new sap.m.Input({
                        value: "",
                        type: sap.m.InputType.Number
                    }),
                    new sap.m.Button({
                        icon: "sap-icon://delete",
                        type: sap.m.ButtonType.Reject,
                        press: function (oEvent) {
                            var oTable = sap.ui.getCore().byId("idOrderItemsTable");
                            oTable.removeItem(oEvent.getSource().getParent());
                        }
                    })
                ]
            });
            oTable.addItem(oItem);
        }, 

    });
});
  

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






