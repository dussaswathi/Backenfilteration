using orderstable from '../db/orders';

service OrderService {

    entity Order     as projection on orderstable.Order;
    entity OrderItems as projection on orderstable.OrderItems;

   // function filterorderitemsByOrderID(OrderID : String) returns OrderItems;
   function filteritems(OrderID:String)  returns OrderItems;
}