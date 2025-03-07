
namespace orderstable ;
    entity Order {
        key ID           : String;
            OrderDate    : Date;
            CustomerName : String(100);
            Items        : Composition of many OrderItems
                               on Items.OrderID = $self;
    }

    entity OrderItems {
        key ItemID      : String;
            ProductName : String(100);
            Quantity    : Integer;
            Price       : Decimal(15, 2);
            OrderID     : Association to Order;
    }
