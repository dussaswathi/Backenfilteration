const cds = require("@sap/cds");
module.exports = srv => {
    srv.on("filteritems", async req => {
        const OrderID = req.data.OrderID;

        const orderitems = await cds.transaction(req).run(
            SELECT.from("orderstable.OrderItems").where({ OrderID: OrderID })
        );

        // console.log("orderitems found:", orderitems);  // Check the response here

        if (orderitems && orderitems.length > 0) {
            return { results: orderitems };  
        } else {
            return { results: [] };  
        }
    });
    // srv.on("RetervingORdersData", async req => {
    //     const OrderID = req.data.OrderID;

    //     const orderdata = await cds.transaction(req).run(
    //         SELECT.from("orderstable.Order").where({ ID: OrderID })
    //     );

    //     // console.log("orderitems found:", orderitems);  // Check the response here

    //     if (orderdata) {
    //         return JSON.stringify(orderdata);
    //     } else {
    //         return JSON.stringify()
    //     }
    // });
   
  
  
    srv.on('orderscreate', async (req) => {
        let parsedData;
    
        try {
            // Parse the stringified JSON data from the URL parameter
            parsedData = JSON.parse(req.data.NewOrdersitemsdetailsData);
        } catch (error) {
            return req.error(400, 'Invalid JSON data provided.');
        }
    
        const { CustomerName, OrderDate, OrderItems } = parsedData;
        const OrderID = String(parsedData.ID);
    
        try {
            // Check if the order ID already exists
            const existingOrder = await cds.transaction(req).run(
                SELECT.from("orderstable.Order").where({ ID: OrderID })
            );
    
            // If the order already exists, only create OrderItems
            if (existingOrder.length > 0) {
                // Insert order items into the database
                for (let item of OrderItems) {
                    await cds.transaction(req).run(
                        INSERT.into('orderstable.OrderItems').entries({
                            ItemID: item.ItemID,
                            ProductName: item.ProductName,
                            Quantity: item.Quantity,
                            Price: item.Price,
                            OrderID_ID: OrderID  // Linking the item to the existing order
                        })
                    );
                }
                // Return success message
                return 'Order items created successfully for existing order';
            } else {
                // If the order doesn't exist, create the order and order items
                await cds.transaction(req).run(
                    INSERT.into('orderstable.Order').entries({
                        ID: OrderID,
                        CustomerName: CustomerName,
                        OrderDate: OrderDate,
                    })
                );
    
                // Insert order items into the database
                for (let item of OrderItems) {
                    await cds.transaction(req).run(
                        INSERT.into('orderstable.OrderItems').entries({
                            ItemID: item.ItemID,
                            ProductName: item.ProductName,
                            Quantity: item.Quantity,
                            Price: item.Price,
                            OrderID_ID: OrderID  // Linking the item to the new order
                        })
                    );
                }
    
                // Return success message
                return 'Order and items created successfully';
            }
        } catch (error) {
            return req.error(500, 'Failed to create order and items: ' + error.message);
        }
    });
    

    // srv.on('orderscreate', async (req) => {
    //     let parsedData;
    
    //     try {
    //         // Parse the stringified JSON data from the URL parameter
    //         parsedData = JSON.parse(req.data.NewOrdersitemsdetailsData);
    //     } catch (error) {
    //         return req.error(400, 'Invalid JSON data provided.');
    //     }
    
    //     const { CustomerName, OrderDate, OrderItems } = parsedData;
    //     const OrderID = String(parsedData.ID);
    
    //     try {
    //         // Check if the order ID already exists
    //         const existingOrder = await cds.transaction(req).run(
    //             SELECT.from("orderstable.Order").where({ ID: OrderID })

    //         );
    
    //         // If the order already exists, return an error
    //         if (existingOrder.length>0) {
    //             return req.error(400, `Order with ID ${OrderID} already exists.`);
    //         }
    
    //         // Insert new order into the database
    //         await cds.transaction(req).run(
    //             INSERT.into('orderstable.Order').entries({
    //                 ID: OrderID,
    //                 CustomerName: CustomerName,
    //                 OrderDate: OrderDate,
    //             })
    //         );
    
    //         // Insert order items into the database
    //         for (let item of OrderItems) {
    //             await cds.transaction(req).run(
    //                 INSERT.into('orderstable.OrderItems').entries({
    //                     ItemID: item.ItemID,
    //                     ProductName: item.ProductName,
    //                     Quantity: item.Quantity,
    //                     Price: item.Price,
    //                     OrderID_ID: OrderID  // Linking the item to the order
    //                 })
    //             );
    //         }
    
    //         // Return success message
    //         return 'Order and items created successfully';
    //     } catch (error) {
    //         return req.error(500, 'Failed to create order and items: ' + error.message);
    //     }
    // });
    

   
    srv.on("DeletesOrderItems", async (req) => {
        const aItemIDs = JSON.parse(req.data.ItemIDs);  // Parse the ItemIDs array sent from the frontend
     
        try {
            // Check if there are any existing items for the provided ItemIDs
            const existingItems = await cds.transaction(req).run(
                SELECT.from("orderstable.OrderItems").where({ ItemID: { in: aItemIDs } })
            );
            if (existingItems.length === 0) {
                return req.error(404, "No items found for the given ItemIDs.");
            }
     
            // Delete the OrderItems based on the ItemIDs
            await cds.transaction(req).run(
                DELETE.from("orderstable.OrderItems").where({ ItemID: { in: aItemIDs } })
            );
     
            return { message: "Order Items deleted successfully." };
        } catch (error) {
            // Handle errors
            return req.error(500, "Error deleting Order Items: " + error.message);
        }
    });
    
    srv.on("UpdateOrderItems", async (req) => {
        let updatedItems;

        try {
            updatedItems = JSON.parse(req.data.UpdatedItems);
        } catch (error) {
            return req.error(400, "Invalid JSON data.");
        }

        if (!updatedItems || updatedItems.length === 0) {
            return req.error(400, "No items received for update.");
        }

        try {
            const data = cds.transaction(req);

            for (const item of updatedItems) {
                await data.run(
                    UPDATE("orderstable.OrderItems")
                        .set({
                            ProductName: item.ProductName,
                            Quantity: item.Quantity,
                            Price: item.Price
                        })
                        .where({ ItemID: item.ItemID })
                );
            }

            return { message: "Order Items updated successfully." };
        } catch (error) {
            return req.error(500, "Failed to update order items: " + error.message);
        }
    });
   
    // srv.on("UpdateOrderItems", async (req) => {
    //     let updatedItems;
    //     let customerName;
    
    //     try {
    //         updatedItems = JSON.parse(req.data.UpdatedItems);
    //         customerName = req.data.CustomerName;  // Extract customer name from the request
    //     } catch (error) {
    //         return req.error(400, "Invalid JSON data.");
    //     }
    
    //     if (!updatedItems || updatedItems.length === 0) {
    //         return req.error(400, "No items received for update.");
    //     }
    
    //     try {
    //         const data = cds.transaction(req);
    
    //         // Update the customer name in the Order table
    //         await data.run(
    //             UPDATE("orderstable.Order")
    //                 .set({ CustomerName: customerName })  // Update customer name
    //                 .where({ ID: updatedItems[0].OrderID_ID })  // Use the order ID from the first item
    //         );
    
    //         // Update the order items
    //         for (const item of updatedItems) {
    //             await data.run(
    //                 UPDATE("orderstable.OrderItems")
    //                     .set({
    //                         ProductName: item.ProductName,
    //                         Quantity: item.Quantity,
    //                         Price: item.Price
    //                     })
    //                     .where({ ItemID: item.ItemID })
    //             );
    //         }
    
    //         return { message: "Order Items and Customer Name updated successfully." };
    //     } catch (error) {
    //         return req.error(500, "Failed to update order items and customer name: " + error.message);
    //     }
    // });
    

     // srv.on('orderscreate', async (req) => {
    //     let parsedData;
    
    //     try {
    //         // Parse the stringified JSON data from the URL parameter
    //         parsedData = JSON.parse(req.data.NewOrdersitemsdetailsData);
    //     } catch (error) {
    //         return req.error(400, 'Invalid JSON data provided.');
    //     }
    
    //     const { ID, CustomerName, OrderDate } = parsedData;
    
    //     try {
    //         // Check if the order ID already exists
    //         const existingOrder = await cds.transaction(req).run(
    //             SELECT.one.from('orderstable.Order')
    //                 .where({ ID: ID })
    //         );
    
    //         if (existingOrder) {
    //             return req.error(400, `Order with ID ${ID} already exists.`);
    //         }
    
    //         // Insert new order into the database
    //         await cds.transaction(req).run(
    //             INSERT.into('orderstable.Order').entries({
    //                 ID: ID,
    //                 CustomerName: CustomerName,
    //                 OrderDate: OrderDate,
    //             })
    //         );
    
    //         // Return success message
    //         return 'Order created successfully';
    //     } catch (error) {
    //         return req.error(500, 'Failed to create order: ' + error.message);
    //     }
    // });
    
    }



