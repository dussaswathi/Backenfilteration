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
            var sOrderID = oEvent.getParameter("value"); // Get the OrderID entered by the user
            var oView = this.getView();
       
            if (sOrderID) {
                var oModel = this.getOwnerComponent().getModel(); // Get the main model of the app
                oModel.callFunction("/filteritems", {
                    method: "GET",
                    urlParameters: { OrderID: sOrderID }, // Send OrderID to backend
                    success: function (oData) {
                        var oOrdersitemsModel = new JSONModel(oData.results || []); // Use empty array if no results
                        oView.setModel(oOrdersitemsModel, "ordersitemsModel"); // Update table data
                    },
                    error: function (err) {
                        MessageToast.show("Could not load filtered OrderItems!");
                        oView.setModel(new JSONModel([]), "ordersitemsModel"); // Clear the table
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
        }
        

    });
});
  // onValueHelpDialogConfirm: function (oEvent) {
        //     var oSelectedItem = oEvent.getParameter("selectedItem");
        //     if (oSelectedItem) {
        //         var sOrderID = oSelectedItem.getTitle();
        //         var oInput = this.getView().byId(this._sInputId); 
        //         oInput.setValue(sOrderID);
        //         // Now, call the backend to fetch filtered OrderItems based on the selected OrderID
        //         var oModel = this.getOwnerComponent().getModel();
              
        //         oModel.callFunction("/filteritems", {
        //             method: "GET",
        //             urlParameters: {
        //                 OrderID: sOrderID  // Corrected the passing of the OrderID
        //             },
        //             success: function (oData, response) {
        //                 var oTable = that.getView().byId("itemTable");
        //                 var oBinding = oTable.getBinding("items");
        //                 oBinding.setModel(new JSONModel(oData));
        //                 var oOrdersitemsModel = new JSONModel(oData.results);
        //                 that.getView().setModel(oOrdersitemsModel, "ordersitemsModel");
        //             },
        //             error: function (oError) {
        //                 sap.m.MessageToast.show("Could not load filtered OrderItems!");
        //                 console.error("Error loading filtered OrderItems:", oError);
        //             }
        //         });
                
                
        //     }
        // },








