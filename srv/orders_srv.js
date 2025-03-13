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

   
    
    



    // srv.on('orderscreate', async (req) => {
    //     let parsedData;
        
    //     try {
    //         // Parse the stringified JSON data from the URL parameter
    //         parsedData = JSON.parse(req.data.NewOrdersitemsdetailsData);
    //     } catch (error) {
    //         return req.error(400, 'Invalid JSON data provided.');
    //     }
    
    //     const { ID, CustomerName, OrderDate, OrderItems } = parsedData;
        
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
    
    //         // Insert order items into the database
    //         for (let item of OrderItems) {
    //             await cds.transaction(req).run(
    //                 INSERT.into('orderstable.OrderItems').entries({
    //                     ItemID: item.ItemID,
    //                     ProductName: item.ProductName,
    //                     Quantity: item.Quantity,
    //                     Price: item.Price,
    //                     OrderID: ID,  // Linking the item to the order
    //                 })
    //             );
    //         }
    
    //         // Return success message
    //         return 'Order and items created successfully';
    //     } catch (error) {
    //         return req.error(500, 'Failed to create order and items: ' + error.message);
    //     }
    // });
    
    
    // // fisrt code
    // srv.on('orderscreate', async (req) => {
    //     let parsedData;
    
    //     try {
    //         // Parse the stringified JSON data from the URL parameter
    //         parsedData = JSON.parse(req.data.NewOrdersitemsdetailsData);
    //     } catch (error) {
    //         return req.error(400, 'Invalid JSON data provided.');
    //     }
    
    //     const { ID, CustomerName, OrderDate, OrderItems } = parsedData;
    
    //     try {
    //         // Check if the order ID already exists
    //         const existingOrder = await cds.transaction(req).run(
    //             SELECT.one.from('orderstable.Order')
    //                 .where({ ID: ID })
    //         );
    
    //         if (existingOrder) {
    //             return req.error(400, `Order with ID ${ID} already exists.`);
    //         }
    
    //         // Begin a transaction
    //         await cds.transaction(req).run(async (tx) => {
    //             // Insert new order
    //             await tx.run(
    //                 INSERT.into('orderstable.Order').entries({
    //                     ID: ID,
    //                     CustomerName: CustomerName,
    //                     OrderDate: OrderDate,
    //                 })
    //             );
    //         // await cds.transaction(req).run(
    //         //                 INSERT.into('orderstable.Order').entries({
    //         //                     ID: ID,
    //         //                     CustomerName: CustomerName,
    //         //                     OrderDate: OrderDate,
    //         //                 })
    //         //             );
    
    //             // Insert multiple order items
    //             if (OrderItems && OrderItems.length > 0) {
    //                 for (let item of OrderItems) {
    //                     await tx.run(
    //                         INSERT.into('orderstable.OrderItems').entries({
    //                             // OrderID: ID,  // Link each item to the order
    //                             ItemID: item.ItemID,
    //                             ProductName: item.ProductName,
    //                             Quantity: item.Quantity,
    //                             Price: item.Price,
    //                             // OrderID_ID:item.ID
    //                             OrderID:item.ID
    //                         })
    //                     );
    //                 }
    //             }
    //             // if (OrderItems && OrderItems.length > 0) {
    //             //     for (let item of OrderItems) {
    //             //         await cds.transaction(req).run(
    //             //             INSERT.into('orderstable.OrderItems').entries({
    //             //                 ItemID: item.ItemID,
    //             //                 ProductName: item.ProductName,
    //             //                 Quantity: item.Quantity,
    //             //                 Price: item.Price,
    //             //                 OrderID: ID,  // Link each item to the order by OrderID
    //             //             })
    //             //         );
    //             //     }
    //             // }

    //         });
    
    //         // Return success message
    //         return 'Order and items created successfully';
    //     } catch (error) {
    //         return req.error(500, 'Failed to create order and items: ' + error.message);
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
    
        const { ID, CustomerName, OrderDate, OrderItems } = parsedData;
    
        try {
            // Check if the order ID already exists
            const existingOrder = await cds.transaction(req).run(
                SELECT.from("orderstable.Order").where({ ID: ID })

            );
    
            // If the order already exists, return an error
            if (existingOrder.length>0) {
                return req.error(400, `Order with ID ${ID} already exists.`);
            }
    
            // Insert new order into the database
            await cds.transaction(req).run(
                INSERT.into('orderstable.Order').entries({
                    ID: ID,
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
                        OrderID: ID  // Linking the item to the order
                    })
                );
            }
    
            // Return success message
            return 'Order and items created successfully';
        } catch (error) {
            return req.error(500, 'Failed to create order and items: ' + error.message);
        }
    });
    
   
    

    
    
    
    
    }



