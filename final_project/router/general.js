const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop using promise
public_users.get("/", function (req, res) {
  let myprom = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  });
  myprom.then((successMessage) => {
    res.send(successMessage);
  });
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Get book details based on ISBN using promise
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let myprom = new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
  myprom.then((successMessage) => {
    res.send(successMessage);
  });
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;
//   for (const key in books) {
//     if (books[key].author == author) res.send(books[key]);
//   }
//   return res.status(404).json({ message: "not exists!" });
// });

// Get book details based on author using promise
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let myprom = new Promise((resolve, reject) => {
    for (const key in books) {
      if (books[key].author == author) resolve(books[key]);
    }
    reject({ message: "not exists!" });
  });
  myprom.then(
    (successMessage) => {
      res.send(successMessage);
    },
    (failed) => {
      res.send(failed);
    }
  );
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   for (const key in books) {
//     if (books[key].title == title) res.send(books[key]);
//   }
//   return res.status(404).json({ message: "not exists!" });
// });

// Get all books based on title using promise
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let myprom = new Promise((resolve, reject) => {
    for (const key in books) {
      if (books[key].title == title) resolve(books[key]);
    }
    reject({ message: "not exists!" });
  });
  myprom.then(
    (successMessage) => {
      res.send(successMessage);
    },
    (failed) => {
      res.send(failed);
    }
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
