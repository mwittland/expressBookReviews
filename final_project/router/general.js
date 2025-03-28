const express = require('express');
//let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// new code
let fs = require('fs');
let path = require('path');
let filename = path.join(__dirname, 'booksdb.json');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  /*
  res.send(JSON.stringify(books, null, 4));
  */
  //new code
  fs.readFile(filename, (err, data) => {
    if (err) {
        res.send("Error getting book info: " + err.message);
    } else {
        let books = JSON.parse(data);
        res.send(JSON.stringify(books, null, 4));
    }
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  fs.readFile(filename, (err, data) => {
    if (err) {
        res.send("Error getting book info: " + err.message);
    } else {
        let books = JSON.parse(data);
        res.send(books[isbn]);
    }
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filtered_books = [];
  fs.readFile(filename, (err, data) => {
    if (err) {
        res.send("Error getting book info: " + err.message);
    } else {
        let books = JSON.parse(data);
        for (const key in books) {
            if (books[key].author.toLowerCase() === author) {
                filtered_books.push(books[key]);
            }
        }
        res.send(filtered_books);
    }
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filtered_books = [];
  fs.readFile(filename, (err, data) => {
    if (err) {
        res.send("Error getting book info: " + err.message);
    } else {
        let books = JSON.parse(data);
        for (const key in books) {
            if (books[key].title === title) {
                filtered_books.push(books[key]);
            }
          }
          res.send(filtered_books);
    }
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
