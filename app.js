/**
 * @jest-environment jsdom
 */

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

let bal;
let bal2;
let amountInput=0;
let numberToInput;
let numberFromInput;
let numberToInput1;
let numberFromInput1;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bankDB", {useNewUrlParser: true, useUnifiedTopology: true})

const accountsSchema = {
  name: {
    type: String,
    required: [true, "No name specified"]
  },
  accNumber: {
    type: Number,
    required:[true, "No account number specified"]
  },
  balance: {
    type: Number,
    required: [true, " Please add balance"]
  }
};

const Account = mongoose.model("Account", accountsSchema);

const transactionsSchema = {
  statement: Number,
  state: String
};

const Transaction = mongoose.model("Transaction", transactionsSchema);




app.get("/", function(req, res) {
  Account.find(function(err, foundAccounts) {
    if(foundAccounts.length===0) {
      Account.insertMany(defaultAccounts, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("home", {accounts: foundAccounts});
    }
  });
});
app.get("/transferMoney", function(req, res) {
  Account.find(function(err, foundAccounts) {
    if(foundAccounts.length===0) {
      Account.insertMany(defaultAccounts, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/transferMoney");
    }
    else {
      res.render("transfer", {accounts: foundAccounts});
    }
  });
});
app.get("/transactionHistory", function(req, res) {


  // var today=new Date();
  //
  //
  // let options = {
  //       weekDay: "long",
  //       day: "numeric",
  //       month: "long",
  //       hour: "numeric",
  //       minute: "numeric",
  //       second:"numeric",
  //       year:"numeric"
  //
  //   };
  //   let day = today.toLocaleDateString("en-US", options);



  const statement1 = new Transaction({
    statement: amountInput,
    state: "debited from"
  });
  const statement2 = new Transaction({
    statement: amountInput,
    state: "credited to"
  });
  Account.find(function(err, foundAccounts) {
    Transaction.find(function(err, statements) {


      if(numberFromInput1===foundAccounts[10].name) {
        Transaction.insertMany(statement1, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Successfully logged");
          }
        });
        res.redirect("/transactionHistory");
      }
      else if(numberToInput1===foundAccounts[10].name) {
        Transaction.insertMany(statement2, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Successfully logged");
          }
        });
        res.redirect("/transactionHistory");
      }
      if(foundAccounts.length===0) {
        Account.insertMany(defaultAccounts, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Successfully inserted");
          }
        });
        res.redirect("/transactionHistory");
      }
      else {
        res.render("history", {accounts: foundAccounts, transaction: statements});
        numberFromInput1=0;
        numberToInput1=0;
      }
    });
  });
});
app.get("/accounts", function(req, res) {
  Account.find(function(err, foundAccounts) {
    if(foundAccounts.length===0) {
      Account.insertMany(defaultAccounts, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/accounts");
    }
    else {
      res.render("accounts", {accounts: foundAccounts});
    }
      for(let i=0; i<foundAccounts.length; i++) {
        if(foundAccounts[i].name === numberToInput) {
          bal2 = foundAccounts[i].balance + amountInput;
          Account.updateOne({name:numberToInput}, {balance: bal2}, function(err) {
            if(err) {
              console.log(err);
              res.redirect("/accounts");
            }
            else {
              console.log("success");
            }
          });
        }
      }
      numberToInput=0;
  });
});

app.post("/transferMoney", function(req, res) {
  amountInput = parseInt(req.body.amount);
  numberFromInput = req.body.fromAccountNumber;
  numberToInput = req.body.toAccountNumber;
  numberFromInput1 = req.body.fromAccountNumber;
  numberToInput1 = req.body.toAccountNumber;
  Account.find(function(err, foundAccounts) {
    for (let i = 0; i < foundAccounts.length; i++) {
      if(foundAccounts[i].name===numberFromInput) {
        bal = foundAccounts[i].balance-amountInput;
        Account.updateOne({name: numberFromInput}, {balance: bal}, function(err) {
          if(err) {
            console.log(err);
            res.redirect("/transferMoney");
          }
          else {
            console.log("success");
          }
        });
      }
    }
    numberFromInput=0;
  });
  res.redirect("/transactionHistory");
});

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
// app.listen(port);

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
