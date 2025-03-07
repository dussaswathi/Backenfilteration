const cds = require("@sap/cds");
module.exports = srv => {
    srv.on("filteritems", async req => {
        const OrderID = req.data.OrderID;

        const orderitems = await cds.transaction(req).run(
            SELECT.from("orderstable.OrderItems").where({ OrderID: OrderID })
        );

        // console.log("orderitems found:", orderitems);  // Check the response here

        if (orderitems && orderitems.length > 0) {
            return { results: orderitems };  // Ensure we return the correct structure
        } else {
            return { results: [] };  
        }
    });
}



