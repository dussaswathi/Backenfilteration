sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageToast,MessageBox, Filter, FilterOperator) {
    "use strict";
    var that;
    return Controller.extend("filterapp.controller.View1", {

        onInit: function () {
            that = this;
            that.valuehelper();  

        
        },
        Oncreateitems:function(){
            if (!that.Oncreateitems_order) {
                that.Oncreateitems_order = sap.ui.xmlfragment("filterapp.fragments.createitems", that);
                that.getView().addDependent(that.Oncreateitems_order); 
            }
            that.Oncreateitems_order.open();
        },
        onitemscreateClose:function(){
            sap.ui.getCore().byId("iditeminput1").setValue("");
            sap.ui.getCore().byId("idproductnameinput1").setValue("");
            sap.ui.getCore().byId("idquantityinput1").setValue("");
            sap.ui.getCore().byId("idpriceinput1").setValue("");

            that.Oncreateitems_order.close();
           
             
           
        },

        onitemscreateSubmit: function () {
            var that = this;
            var sOrderID = this.getView().byId("idInput").getValue();
            var items = sap.ui.getCore().byId("idOrderItemsTable1").getItems();
            var oModel = this.getOwnerComponent().getModel();
            var ordersitemsModel = this.getView().getModel("ordersitemsModel"); // Get the table model
        
            var orderItems = [];
            var validationErrors = [];
        
            var orderData = {
                OrderItems: orderItems  
            };
            // Read existing Order Items to check for duplicates
            oModel.read("/OrderItems", {
                success: function (oData) {
                    var existingItemIDs = new Set(oData.results.map(function (item) {
                        return item.ItemID.toString();
                    }));
                    // Loop through all items in the table
                    items.forEach(function (item, index) {
                        var cells = item.getCells();
                        var itemID = cells[0].getValue();
                        var productName = cells[1].getValue();
                        var quantity = cells[2].getValue();
                        var price = cells[3].getValue();
        
                        if (!itemID || isNaN(itemID) || itemID.trim() === "") {
                            validationErrors.push(`Row ${index + 1}: Item ID must be a valid number.`);
                        } else if (existingItemIDs.has(itemID)) {
                            validationErrors.push(`Row ${index + 1}: Item ID '${itemID}' already exists.`);
                        }
                        if (!productName || productName.trim() === "") {
                            validationErrors.push(`Row ${index + 1}: Product Name is required.`);
                        }
                        if (!quantity || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
                            validationErrors.push(`Row ${index + 1}: Quantity must be a valid positive number.`);
                        }
                        if (!price || isNaN(price) || parseFloat(price) <= 0) {
                            validationErrors.push(`Row ${index + 1}: Price must be a valid positive number.`);
                        }
                        // If no validation errors, add item to orderItems array
                        if (validationErrors.length === 0) {
                            var itemData = {
                                ItemID: itemID,
                                ProductName: productName,
                                Quantity: parseInt(quantity, 10),
                                Price: parseFloat(price),
                                OrderID: sOrderID
                            };
                            orderItems.push(itemData);
                        }
                    });
        
                    if (validationErrors.length > 0) {
                        sap.m.MessageBox.error(validationErrors.join("\n"));
                        return;
                    }
        
                    // Convert order data to JSON string
                    var jsonString = JSON.stringify(orderData);
                    oModel.callFunction("/Creatingitemsforexistingorderid", {
                        method: "GET",
                        urlParameters: {
                            OrderitemsData: jsonString
                        },
                        success: function () {
                            sap.m.MessageToast.show("Items created successfully!");
                            //  Add new items to ordersitemsModel manually before refreshing
                            var existingData = ordersitemsModel.getData();
                            if (!existingData || !existingData.length) {
                                existingData = [];
                            }
                            existingData = existingData.concat(orderItems); // Append new items
                            ordersitemsModel.setData(existingData); // Update the model
        
                            var oTable = that.byId("itemTable");
                            oTable.getBinding("items").refresh(); // Refresh table
                            that.onitemscreateClose();
                        },
                        error: function (error) {
                            var errorMessage = error.responseText;
                            var parsedError = JSON.parse(errorMessage);
                            var message = parsedError.error.message.value;
                            sap.m.MessageToast.show(message || "Error creating order and items!");
                        }
                    });
                },
                error: function () {
                    sap.m.MessageToast.show("Error reading existing order items!");
                }
            });
        },   

       
        OnDeleteOrderID: function () {
            var that = this;
            var sOrderID = that.getView().byId("idInput").getValue();  
            if (!sOrderID) {
                MessageToast.show("Please enter a valid OrderID.");
                return;
            }
            sap.m.MessageBox.confirm(
                "Are you sure you want to delete this order and its associated items?", 
                {
                icon: sap.m.MessageBox.Icon.WARNING, 
                title: "Delete Order", 
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
                onClose: function (sAction) {
                // If user clicks YES, proceed with deletion
                if (sAction === sap.m.MessageBox.Action.YES) {
                    var oModel = that.getOwnerComponent().getModel(); 
                    oModel.callFunction("/deleteorderidanditems", {
                        method: "GET",
                        urlParameters: {
                            OrderID: sOrderID 
                        },
                        success: function (oData) {
                            MessageToast.show("Order and associated items deleted successfully!");
                            var oTable = that.getView().byId("itemTable"); 
                            // Create a new empty model to clear the table
                            var oEmptyModel = new JSONModel([]);
                            oTable.setModel(oEmptyModel);  // Set the empty model to the table
                            that.getView().setModel(oEmptyModel, "ordersitemsModel");
                            that.getView().byId("idInput").setValue(""); 
                            that.getView().byId("idcreateitems").setEnabled(false); 
                        },
                        error: function (oError) {
                            MessageToast.show("Error deleting order and items.");
                        }
                    });
                }
            }
        }
            );
        },
        
      
        
        onAddNewitemsRow: function () {
            var oTable = sap.ui.getCore().byId("idOrderItemsTable1");
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
                            var oTable = sap.ui.getCore().byId("idOrderItemsTable1");
                            oTable.removeItem(oEvent.getSource().getParent());
                        }
                    })
                ]
            });
            // Add a custom data attribute to identify the dynamically added rows
            // Mark this row as dynamically added
            oItem.setBindingContext(null);
            oItem.data("isDynamicallyAdded", true); 

            oTable.addItem(oItem);
        },
        OnOrderandItems:function(){
            if (!that.Order_items) {
                that.Order_items = sap.ui.xmlfragment("filterapp.fragments.Multicreate", that);
                that.getView().addDependent(that.Order_items); 
            }
            that.Order_items.open();
        },
        onMulticreateClose:function(){
            sap.ui.getCore().byId("idID").setValue("");
            sap.ui.getCore().byId("idCustomerName").setValue("");
            sap.ui.getCore().byId("iditeminput").setValue("");
            sap.ui.getCore().byId("idproductnameinput").setValue("");
            sap.ui.getCore().byId("idquantityinput").setValue("");
            sap.ui.getCore().byId("idpriceinput").setValue("");


            var oTable = sap.ui.getCore().byId("idOrderItemsTable");       
            var aTableItems = oTable.getItems();
            aTableItems.forEach(function(oItem) {
                // Check if the row is dynamically added
                if (oItem.data("isDynamicallyAdded")) {
                    oTable.removeItem(oItem);
                }
            });

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
 
        onMultiUpdateClose: function(){
        var oTable = this.byId("itemTable");
        if (oTable) {
            oTable.removeSelections(true); 
        }
        this._oMultiUpdateFragment.close();
        },
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
        //      var oUpdateModel = new JSONModel(aItemsToUpdate);
        //     that._oMultiUpdateFragment.setModel(oUpdateModel, "updateModel"); 
        //     that._oMultiUpdateFragment.open();
                    
        // },
          
        // onMultiUpdateSubmit: function () {
        //     var oUpdateModel = this._oMultiUpdateFragment.getModel("updateModel");
        //     var aUpdatedItems = oUpdateModel.getData();      
        //     if (!aUpdatedItems || aUpdatedItems.length === 0) {
        //         sap.m.MessageToast.show("No items available for update.");
        //         return;
        //     }       
        //     var oPayload = {
        //         UpdatedItems: JSON.stringify(aUpdatedItems) // Convert to JSON string for transmission
        //     };
        
        //     var oModel = this.getOwnerComponent().getModel();      
        //     oModel.callFunction("/UpdateOrderItems", {
        //         method: "GET",
        //         urlParameters: oPayload,
        //         success: function (oData) {
        //             sap.m.MessageToast.show("Items updated successfully.");
        //             this._oMultiUpdateFragment.close();
        //             var oOrdersItemsModel = this.getView().getModel("ordersitemsModel"); 
        //             if (oOrdersItemsModel) {
        //                 oOrdersItemsModel.refresh(true); 
        //             }
        //             var oTable = this.byId("itemTable");
        //             if (oTable) {
        //                 oTable.removeSelections(true); 
        //             }
        //         }.bind(this),
        //         error: function (Err) {
        //             sap.m.MessageBox.error("Failed to update items.");
        //         }
        //     });
        // },
        onUpdateOrder: function (oEvent) {
            var oTable = this.byId("itemTable");
            if (!oTable) {
                sap.m.MessageToast.show("Table not found.");
                return;
            }
        
            var aSelectedItems = oTable.getSelectedItems();
            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select at least one item to update.");
                return;
            }
        
            // Create the update fragment only once
            if (!this._oMultiUpdateFragment) {
                this._oMultiUpdateFragment = sap.ui.xmlfragment("filterapp.fragments.Updatemulti", this);
                this.getView().addDependent(this._oMultiUpdateFragment);
            }
        
            // Retrieve the selected items data and ensure they have necessary fields (ProductName, Quantity, Price)
            var aItemsToUpdate = aSelectedItems.map(function (oItem) {
                var oData = oItem.getBindingContext("ordersitemsModel").getObject();
                
                // Validate item data before adding it to the list for update
                if (!oData.ProductName || !oData.Quantity || !oData.Price) {
                    sap.m.MessageToast.show("Selected items have incomplete data.");
                    return null;
                }
        
                return oData;
            }).filter(Boolean); // Remove invalid items (nulls)
        
            if (aItemsToUpdate.length === 0) {
                sap.m.MessageToast.show("No valid items selected for update.");
                return;
            }
        
            // Set the selected and valid items into the update model
            var oUpdateModel = new JSONModel(aItemsToUpdate);
            this._oMultiUpdateFragment.setModel(oUpdateModel, "updateModel");
            this._oMultiUpdateFragment.open();
        },
        
        onMultiUpdateSubmit: function () {
            var oUpdateModel = this._oMultiUpdateFragment.getModel("updateModel");
            var aUpdatedItems = oUpdateModel.getData();
        
            if (!aUpdatedItems || aUpdatedItems.length === 0) {
                sap.m.MessageToast.show("No items available for update.");
                return;
            }
        
            var validationErrors = [];
        
            // Validate each item in the list
            aUpdatedItems.forEach(function (oItem, index) {
                if (!oItem.ProductName || oItem.ProductName.trim() === "") {
                    validationErrors.push(`Row ${index + 1}: Product Name is required.`);
                }
                if (!oItem.Quantity || isNaN(oItem.Quantity) || parseInt(oItem.Quantity, 10) <= 0) {
                    validationErrors.push(`Row ${index + 1}: Quantity must be a valid positive number.`);
                }
                if (!oItem.Price || isNaN(oItem.Price) || parseFloat(oItem.Price) <= 0) {
                    validationErrors.push(`Row ${index + 1}: Price must be a valid positive number.`);
                }
            });
        
            // If there are validation errors, display them
            if (validationErrors.length > 0) {
                sap.m.MessageBox.error(validationErrors.join("\n"));
                return;
            }
        
            // Prepare the payload for the update request
            var oPayload = {
                UpdatedItems: JSON.stringify(aUpdatedItems) // Convert to JSON string for transmission
            };
        
            // Get the model and send the update request to the backend
            var oModel = this.getOwnerComponent().getModel();
            oModel.callFunction("/UpdateOrderItems", {
                method: "POST", // You may need to change this to "PUT" if your backend expects PUT for updates
                urlParameters: oPayload,
                success: function () {
                    sap.m.MessageToast.show("Items updated successfully.");
                    this._oMultiUpdateFragment.close();
        
                    // Refresh the local model and the table
                    var oOrdersItemsModel = this.getView().getModel("ordersitemsModel");
                    if (oOrdersItemsModel) {
                        oOrdersItemsModel.refresh(true); // Refresh the items model to reflect updates
                    }
        
                    var oTable = this.byId("itemTable");
                    if (oTable) {
                        oTable.removeSelections(true); // Clear the selection in the table
                    }
                }.bind(this),
                error: function (Err) {
                    sap.m.MessageBox.error("Failed to update items.");
                }
            });
        },
        
        
   
        onDeleteOrder: function (oEvent) {
            var oTable = this.byId("itemTable"); 
            var aSelectedItems = oTable.getSelectedItems(); 
        
            if (aSelectedItems.length === 0) {
                sap.m.MessageBox.error("Please select at least one item to delete.");
                return;
            }
            var aItemIDs = aSelectedItems.map(function (oItem) {
                var oContext = oItem.getBindingContext("ordersitemsModel");
                return oContext.getProperty("ItemID");
            });
            sap.m.MessageBox.confirm(  "Are you sure you want to delete the selected items?",{
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            // Proceed with deletion if "YES" is selected
                            var oModel = this.getOwnerComponent().getModel();
                            oModel.callFunction("/DeletesOrderItems", {
                                method: "GET",
                                urlParameters: { ItemIDs: JSON.stringify(aItemIDs) }, // Send array of ItemIDs
                                // success: function (oData) {
                                //     sap.m.MessageToast.show("Items deleted successfully."); 
                                                               
                                // }.bind(this),
                                success: function (oData) {
                                    sap.m.MessageToast.show("Items deleted successfully.");                                   
                                    // Retrieve the current model
                                    var oOrdersItemsModel = this.getView().getModel("ordersitemsModel");                               
                                    // Get the data and filter out the deleted items
                                    var aItemsData = oOrdersItemsModel.getData();                                   
                                    // Remove the deleted items from the model data
                                    var filteredItemsData = aItemsData.filter(function(item) {
                                        return !aItemIDs.includes(item.ItemID); // Filter out deleted items
                                    });                               
                                    // Update the model data
                                    oOrdersItemsModel.setData(filteredItemsData);                               
                                    // Refresh the table to reflect changes
                                    oTable.getBinding("items").refresh();                                    
                                }.bind(this),                               
                                error: function (oError) {
                                    sap.m.MessageBox.error("An error occurred while deleting the items.");
                                }
                            });
                        } else {
                            sap.m.MessageToast.show("Deletion canceled.");
                        }
                    }.bind(this)
                }
            );
        },
        
        onLiveSearchitemid: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue"); // Get the search query entered by the user
            var oTable = this.byId("itemTable"); // Get the table control
            var oBinding = oTable.getBinding("items"); // Get the binding of the table items
            var aFilters = [];
            if (sQuery) {
                // Apply a filter for ItemID if the search query is not empty
                var oFilter = new Filter({
                    path: "ItemID", 
                    operator: FilterOperator.StartsWith, 
                    value1: sQuery 
                });
                aFilters.push(oFilter);
            }
            // Apply the filter to the table binding
            oBinding.filter(aFilters);
        }, 
       
        onIDMultiLiveChange: function (oEvent) {
            var sID = oEvent.getSource().getValue();
            var oModel = this.getOwnerComponent().getModel();
            // Get the input controls once
            var oCustomerNameInput = sap.ui.getCore().byId("idCustomerName");
            var oOrderIDInput = sap.ui.getCore().byId("idID");
            if (sID) {
                // Step 1: Check if Order with the entered ID exists
                oModel.read("/Order('" + sID + "')", {
                    success: function (res) {
                        // Populate the fields if the order exists
                        oCustomerNameInput.setValue(res.CustomerName);
                        oOrderIDInput.setValue(res.ID);
                        // Make CustomerName input non-editable, and OrderID editable
                        oCustomerNameInput.setEditable(false);
                        oOrderIDInput.setEditable(true);
                    },
                    error: function () {
                        // Clear the fields if the order doesn't exist
                        oCustomerNameInput.setValue("");
                        oOrderIDInput.setValue(sID);
                        // Make both inputs editable
                        oCustomerNameInput.setEditable(true);
                        oOrderIDInput.setEditable(true);
                    }
                });
            } else {
                // If the ID is empty, reset fields and make them editable
                oCustomerNameInput.setValue("");
                oOrderIDInput.setValue("");       
                oCustomerNameInput.setEditable(true);
                oOrderIDInput.setEditable(true);
            }
        },
        
    onMulticreateSubmit: function () {
        var sID = sap.ui.getCore().byId("idID").getValue();
        var sCustomerName = sap.ui.getCore().byId("idCustomerName").getValue();
        var items = sap.ui.getCore().byId("idOrderItemsTable").getItems();
        var ordersitemsModel = this.getView().getModel("ordersitemsModel");
        var currentDate = new Date();
    
        var orderItems = [];
        var validationErrors = [];

        var orderData = {
            ID: parseInt(sID, 10),
            OrderDate: currentDate,
            CustomerName: sCustomerName,
            OrderItems: orderItems
        };

        if (!sID || isNaN(sID)) {
            validationErrors.push("Order ID must be a valid number.");
        }
        if (!sCustomerName || sCustomerName.trim() === "") {
            validationErrors.push("Customer Name is required and cannot be empty.");
        }   
      
        var oModel = this.getOwnerComponent().getModel();
        // Fetch existing OrderItems from backend and validate new items
        oModel.read("/OrderItems", {
            success: function (oData) {
                var existingItemIDs = new Set(oData.results.map(function (item) {
                    return item.ItemID.toString();
                }));
                items.forEach(function (item, index) {
                    var cells = item.getCells();
                    var itemID = cells[0].getValue();
                    var productName = cells[1].getValue();
                    var quantity = cells[2].getValue();
                    var price = cells[3].getValue();
    
                    if (!itemID || isNaN(itemID)) {
                        validationErrors.push(`Row ${index + 1}: Item ID must be a valid number.`);
                    } else if (existingItemIDs.has(itemID)) {
                        validationErrors.push(`Row ${index + 1}: Item ID '${itemID}' already exists.`);
                    }
                    if (!productName || productName.trim() === "") {
                        validationErrors.push(`Row ${index + 1}: Product Name is required.`);
                    }
                    if (!quantity || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
                        validationErrors.push(`Row ${index + 1}: Quantity must be a valid positive number.`);
                    }
                    if (!price || isNaN(price) || parseFloat(price) <= 0) {
                        validationErrors.push(`Row ${index + 1}: Price must be a valid positive number.`);
                    }
                    // Add valid order items to the orderItems array
                    if (validationErrors.length === 0) {
                        orderItems.push({
                            ItemID: parseInt(itemID, 10),
                            ProductName: productName,
                            Quantity: parseInt(quantity, 10),
                            Price: parseFloat(price),
                            OrderID: sID
                        });
                    }
                });
                if (validationErrors.length > 0) {
                    sap.m.MessageBox.error(validationErrors.join("\n"));
                    return;
                }  
                // Proceed with order creation
                // var orderData = {
                //     ID: parseInt(sID, 10),
                //     OrderDate: currentDate,
                //     CustomerName: sCustomerName,
                //     OrderItems: orderItems
                // };  
                var jsonString = JSON.stringify(orderData); 
                oModel.callFunction("/orderscreate", {
                    method: "GET",
                    urlParameters: { NewOrdersitemsdetailsData: jsonString },
                    success: function () {
                        sap.m.MessageToast.show("Order and items created successfully!");
                        that.onMulticreateClose();
                        var existingData = ordersitemsModel.getData();
                        if (!existingData || !existingData.length) {
                            existingData = [];
                        }
                        existingData = existingData.concat(orderItems); // Append new items
                        ordersitemsModel.setData(existingData); // Update the model
    
                        var oTable = that.byId("itemTable");
                        oTable.getBinding("items").refresh(); // Refresh table
                    },
                  
                    error: function (error) {
                        var errorMessage = error.responseText;
                        var parsedError = JSON.parse(errorMessage);
                        var message = parsedError.error.message.value;
                        sap.m.MessageToast.show(message || "Error creating order and items!");
                    }
                });
            },
            error: function () {
                sap.m.MessageBox.error("Failed to fetch existing Order Items. Please try again.");
            }
        });
    },

    
        valuehelper: function () {
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Order", {
                success: function (oData) {
                    if (that.valueModel) {
                        var sortedData = oData.results.sort((a, b) => Number(a.ID) - Number(b.ID));
                        that.valueModel.setData({ results: sortedData });
                    }
                },
                error: function (oError) {
                    sap.m.MessageToast.show("Could not load Orders data!");
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
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var oTable = that.getView().byId("itemTable"); // Table for displaying the order items
            var oCreateButton = that.getView().byId("idcreateitems"); // Button to create items
        
            if (oSelectedItem) {
                var sOrderID = oSelectedItem.getTitle(); // Get the selected OrderID
                var oInput = this.getView().byId(this._sInputId);
                oInput.setValue(sOrderID); // Set selected OrderID in input field
        
                var oModel = this.getOwnerComponent().getModel();
        
                // Call the backend service to fetch filtered items for the selected OrderID
                oModel.callFunction("/filteritems", {
                    method: "GET",
                    urlParameters: { OrderID: sOrderID },
                    success: function (oData) {
                        // If data is returned, update the model and refresh the table
                        if (oData.results && oData.results.length > 0) {
                            var oOrdersitemsModel = new JSONModel(oData.results); // Create model with the filtered results
                            that.getView().setModel(oOrdersitemsModel, "ordersitemsModel"); // Set the model for the view
                            oTable.setModel(oOrdersitemsModel); // Bind the data to the table
        
                            // Enable the "Create" button
                            oCreateButton.setEnabled(true);
                            oTable.getBinding("items").refresh(); // Refresh the table to show the updated data
                        } else {
                            // Show message if no data is found, and clear the table
                            MessageToast.show("No order items found for the selected OrderID.");
                            // Clear the table data (reset the model to an empty array)
                            that.getView().setModel(new JSONModel([]), "ordersitemsModel");
                            oTable.setModel(new JSONModel([])); // Set an empty model for the table
        
                            // Optionally, enable the "Create" button (even if no data is found)
                            oCreateButton.setEnabled(true);
                        }
                    },
                    error: function (oError) {
                        // Handle error and clear the table data
                        MessageToast.show("Could not load filtered OrderItems!");
                        console.error("Error loading filtered OrderItems:", oError);
                        // Clear the table data on error
                        that.getView().setModel(new JSONModel([]), "ordersitemsModel");
                        oTable.setModel(new JSONModel([])); // Set an empty model for the table
                        oCreateButton.setEnabled(false); // Optionally, disable the "Create" button
                    }
                });
            }
        },
        
        onCustomerLiveChange: function (oEvent) {
            var that = this;
            var sOrderID = oEvent.getParameter("value"); 
            var oView = this.getView();
            var oCreateButton = that.getView().byId("idcreateitems");
            oCreateButton.setEnabled(false); // Disable the button initially
        
            if (sOrderID) {
                var oModel = this.getOwnerComponent().getModel();
        
                // Call the backend service to fetch filtered items based on the OrderID
                oModel.callFunction("/filteritems", {
                    method: "GET",
                    urlParameters: { OrderID: sOrderID },
                    success: function (oData) {
                        var aResults = oData.results || []; // Handle the case where no results are returned
                        if (aResults.length === 0) {
                            MessageToast.show("No records found for the given OrderID.");
                            // Clear the table data if no results
                            oView.setModel(new JSONModel([]), "ordersitemsModel");
                            oCreateButton.setEnabled(false); // Disable the button if no data
                        } else {
                            var oOrdersitemsModel = new JSONModel(aResults); // Create a new model with the filtered results
                            oView.setModel(oOrdersitemsModel, "ordersitemsModel");
                            oCreateButton.setEnabled(true); // Enable the "Create" button
                        }
                    },
                    error: function (err) {
                        MessageToast.show("Could not load filtered OrderItems!");
                        // Clear the table data and reset the button in case of error
                        oView.setModel(new JSONModel([]), "ordersitemsModel");
                        oCreateButton.setEnabled(false); // Disable the button on error
                    }
                });
            } else {
                // If the input is empty, clear the table and disable the button
                oView.setModel(new JSONModel([]), "ordersitemsModel");
                oCreateButton.setEnabled(false); // Disable the button when no OrderID is entered
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
            // Add a custom data attribute to identify the dynamically added rows
            // Mark this row as dynamically added
            oItem.setBindingContext(null);
            oItem.data("isDynamicallyAdded", true); 

            oTable.addItem(oItem);
        }

    });
});
   // OnDeleteOrderID: function () {
        //     var that = this;
        //     var sOrderID = that.getView().byId("idInput").getValue(); 
        //     if (!sOrderID) {
        //         MessageToast.show("Please enter a valid OrderID.");
        //         return;
        //     }
        //     var oModel = that.getOwnerComponent().getModel();
        //     // Call the backend function to delete the order and associated items
        //     oModel.callFunction("/deleteorderidanditems", {
        //         method: "GET",
        //         urlParameters: {
        //             OrderID: sOrderID  
        //         },
        //         success: function (oData) {
        //             MessageToast.show("Order and associated items deleted successfully!");         
        //             // that.clearTable();
        //             var oTable = that.getView().byId("itemTable");  
        //             oTable.setModel(new JSONModel([])); 
        //             that.getView().byId("idInput").setValue(""); 

                   
        //         },
              
        //         error: function (oError) {
        //             MessageToast.show("Error deleting order and items.");
        //         }
        //     });
        // },
  // onMulticreateSubmit: function () {
        //     // Get values from the form fields
        //     var sID = sap.ui.getCore().byId("idID").getValue();
        //     var sCustomerName = sap.ui.getCore().byId("idCustomerName").getValue();
        //     var currentDate = new Date();
        
        //     // Get the order items from the table
        //     var orderItems = [];
            
        //     var items = sap.ui.getCore().byId("idOrderItemsTable").getItems();
        
        //     items.forEach(function (item) {
        //         var cells = item.getCells();
        //         var itemData = {
        //             ItemID: cells[0].getValue(),
        //             ProductName: cells[1].getValue(),
        //             Quantity: parseInt(cells[2].getValue(), 10),
        //             Price: parseFloat(cells[3].getValue()),
        //             OrderID: sID
        //         };
        //         orderItems.push(itemData);
        //     });
        
        //     // Create the order data object
        //     var orderData = {
        //         ID: sID,
        //         OrderDate: currentDate,
        //         CustomerName: sCustomerName,
        //         OrderItems: orderItems  // Include the order items in the request
        //     };
        
        //     // Convert order data to JSON string
        //     var jsonString = JSON.stringify(orderData);      
        //     var oModel = this.getOwnerComponent().getModel();
        
        //     // Call the OData function to create the order and items
        //     oModel.callFunction("/orderscreate", {
        //         method: "GET",  
        //         urlParameters: { // Passing the order data (including items) as URL parameters
        //             NewOrdersitemsdetailsData: jsonString 
        //         },
        //         success: function (oData) {
        //             sap.m.MessageToast.show("Order and items created successfully!");
        //             that.Order_items.close();
        //         },
        //         error: function (error) {
        //             var errorMessage = error.responseText;                    
        //             // Extract the specific error message from the response
        //             var parsedError = JSON.parse(errorMessage);
        //             var message = parsedError.error.message.value;       
        //             // Check if the error message contains "Order with ID"
        //             if (message && message.includes("Order with ID")) {
        //                 sap.m.MessageToast.show(message);  // Display the specific error message
        //             } else {
        //                 sap.m.MessageToast.show("Error creating order and items!");
        //             }
        //         }
        //     });
        // },
        
     // onValueHelpDialogConfirm: function (oEvent) {
        //     var that = this;
        //     var oSelectedItem = oEvent.getParameter("selectedItem");
        //     if (oSelectedItem) {
        //         var sOrderID = oSelectedItem.getTitle();
        //         var oInput = this.getView().byId(this._sInputId); 
        //         oInput.setValue(sOrderID);
        //         var oModel = this.getOwnerComponent().getModel();       
        //         oModel.callFunction("/filteritems", {
        //             method: "GET",
        //             urlParameters: {
        //                 OrderID: sOrderID
        //             },
        //             success: function (oData, response) {
        //                 // Check if we have valid data in oData
        //                 if (oData.results && oData.results.length > 0) {
        //                     var oOrdersitemsModel = new JSONModel(oData.results);  // Use results directly
        //                     that.getView().setModel(oOrdersitemsModel, "ordersitemsModel"); 
        //                     var oCreateButton = that.getView().byId("idcreateitems");
        //                     oCreateButton.setEnabled(true);       
        //                 } else {
        //                     // var oTable = this.byId("itemTable");
        //                     // oTable.getBinding("items").refresh();  
        //                     MessageToast.show("No order items found for the selected OrderID.");
        //                     var oCreateButton = that.getView().byId("idcreateitems");
        //                     oCreateButton.setEnabled(true);
        //                 }
        //             },
        //             error: function (oError) {
        //                 MessageToast.show("Could not load filtered OrderItems!");
        //                 console.error("Error loading filtered OrderItems:", oError);
                       
        //             }
        //         });
        //     }
        // },

         // // onCustomerLiveChange: function (oEvent) {
        // //     var that = this;
        // //     var sOrderID = oEvent.getParameter("value"); 
        // //     var oView = this.getView();
        // //     if (sOrderID) {
        // //         var oModel = this.getOwnerComponent().getModel(); 
        // //         oModel.callFunction("/filteritems", {
        // //             method: "GET",
        // //             urlParameters: { OrderID: sOrderID }, // Send OrderID to backend
        // //             success: function (oData) {
        // //                 // Get the results array, or an empty array if no results
        // //                 var aResults = oData.results || []; 
        // //                 if (aResults.length === 0) {
        // //                     MessageToast.show("No records found for the given OrderID."); 
        // //                 } // Use the results (or empty array if no results)
        // //                 var oOrdersitemsModel = new JSONModel(aResults);
        // //                 oView.setModel(oOrdersitemsModel, "ordersitemsModel"); 
        // //             },
        // //             error: function (err) {
        // //                 MessageToast.show("Could not load filtered OrderItems!");
        // //                 oView.setModel(new JSONModel([]), "ordersitemsModel");
        // //             }
        // //         });
        // //     } else {
        // //         // If input is empty, clear the table
        // //         oView.setModel(new JSONModel([]), "ordersitemsModel");
        // //     }
        // // },
        // onCustomerLiveChange: function (oEvent) {
        //     var that = this;
        //     var sOrderID = oEvent.getParameter("value"); 
        //     var oView = this.getView();
        //     var oCreateButton = that.getView().byId("idcreateitems");
        //     oCreateButton.setEnabled(false); 
        
        //     if (sOrderID) {
        //         var oModel = this.getOwnerComponent().getModel(); 
        //         oModel.callFunction("/filteritems", {
        //             method: "GET",
        //             urlParameters: { OrderID: sOrderID }, // Send OrderID to backend
        //             success: function (oData) {
        //                 // Get the results array, or an empty array if no results
        //                 var aResults = oData.results || []; 
        //                 if (aResults.length === 0) {
        //                     MessageToast.show("No records found for the given OrderID.");
        //                 } else { // Use the results to update the model
        //                     var oOrdersitemsModel = new JSONModel(aResults);
        //                     oView.setModel(oOrdersitemsModel, "ordersitemsModel");
        //                     // Enable the "Additems" button only if data is found
        //                     oCreateButton.setEnabled(true); 
        //                 }
        //             },
        //             error: function (err) {
        //                 MessageToast.show("Could not load filtered OrderItems!");
        //                 oView.setModel(new JSONModel([]), "ordersitemsModel");
        //             }
        //         });
        //     } else { // If input is empty, clear the table and disable the button
        //         oView.setModel(new JSONModel([]), "ordersitemsModel");
        //         oCreateButton.setEnabled(false); 
        //     }
        // },