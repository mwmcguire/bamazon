// require node packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var divider = "------------------------------------";

// set variable for mysql connection information
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});

// connect to mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log ("connected as id " + connection.threadId);
  displayItems();
});


// display all items for sale (ids, names, and price)
function displayItems() {

  // query database for all items available
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log (
        "Item ID: " + res[i].item_id +
        " || Product name: " + res[i].product_name +
        " || Price: " + res[i].price
      );
      console.log(divider);
    }
    purchaseItem();
  });
}

// ask user what they want to purchase:
  // ID of product they would like to buy
  // how many units they would like to buy
function purchaseItem() {
  inquirer.prompt([
    {
      name: "item_id",
      type: "input",
      message: "Enter the Item ID of the product you would like to buy"
    },
    {
      name: "item_quantity",
      type: "input",
      message: "Enter the quantity of this item "
    }
  ])
  .then(function(selection) {
    connection.query("SELECT * FROM products WHERE ?", { item_id: selection.item_id }, function(err, res) {
      if (err) throw err
      console.log(res);

      var stockQuantity = res[0].stock_quantity;
      var price = res[0].price;

      // check inventory if there is enough to meet customer request
      if (stockQuantity <= 0 || selection.item_quantity > stockQuantity) {
        console.log ("Insufficient quantity!");  // if NO - log "Insufficient quantity!" then prevent order from going through
        setTimeout(function() { displayItems() }, 3000)
      } else {
        console.log ("Placing order...");  // if YES - fullfill customer's request
        
        // update database inventory with remaining quantity
        connection.query(
          "UPDATE products SET ? WHERE ? ",
          [
            {
              stock_quantity: stockQuantity - selection.item_quantity
            },
            {
              item_id: selection.item_id
            }
          ], function (err, res) {
            if (err) throw err

            // show customer total cost of purchase
            console.log ("Order placed!");
            console.log ("Your total is $" + price * selection.item_quantity);
            connection.end();
          })
      }
    })
  })
}