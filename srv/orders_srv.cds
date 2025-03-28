using orderstable from '../db/orders';

service OrderService {

    entity Order      as projection on orderstable.Order;
    entity OrderItems as projection on orderstable.OrderItems;
    // function filterorderitemsByOrderID(OrderID : String) returns OrderItems;
    function filteritems(OrderID : String)                    returns OrderItems;
    // function createOrder(OrderID: String, CustomerName: String, OrderDate: Date) returns Order;
    //  function createOrder(NewOrdersitemsdetailsData: String);
    function orderscreate(NewOrdersitemsdetailsData : String) returns String;
    function DeletesOrderItems(ItemIDs : String)              returns String;
    function UpdateOrderItems(UpdatedItems : String)          returns String;
    // function RetervingORdersData(OrderID : String)            returns String;
    function Creatingitemsforexistingorderid(OrderitemsData:String) returns String;
    function deleteorderidanditems(OrderID : String)          returns String;

}
