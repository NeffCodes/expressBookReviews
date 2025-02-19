const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
  return await new Promise((resolve, reject) => {
    try {
      const data = books;
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

const prettify = (msg) => JSON.stringify(msg, null, 4);

//POST register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: `User ${username} Registered Successfully. You can now log in`,
      });
    } else {
      return res
        .status(404)
        .json({ message: `User ${username} Already registered` });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  await getBooks()
    .then((data) => {
      return res.status(200).send(prettify(data));
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "Internal server error" });
    });
});

const getByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
    let isbnCode = parseInt(isbn);
    if (books[isbnCode]) {
      resolve(books[isbnCode]);
    } else {
      reject({ status: 404, message: `ISBN ${isbn} not found` });
    }
  });
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  await getByISBN(isbn).then(
    (result) => res.status(300).send(prettify(result)),
    (error) => res.status(error.status).send(`ISBN ${isbn} does not exist`),
  );
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  await getBooks()
    .then((list) => {
      //get isbn keys
      const listKeys = Object.keys(list);

      //find books by author
      const authorsBooks = [];
      for (key of listKeys) {
        if (list[key].author === author) {
          authorsBooks.push({
            isbn: key,
            title: list[key].title,
            reviews: list[key].reviews,
          });
        }
      }

      return authorsBooks.length > 0
        ? res.status(300).send(prettify({ booksByAuthor: authorsBooks }))
        : res
            .status(404)
            .send(`We currently do not have any books by ${author}`);
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message);
    });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  await getBooks()
    .then((list) => {
      //get isbn keys
      const listKeys = Object.keys(list);

      //find books by title
      const titleBooks = [];
      for (key of listKeys) {
        if (list[key].title === title) {
          titleBooks.push({
            isbn: key,
            author: list[key].author,
            reviews: list[key].reviews,
          });
        }
      }

      return titleBooks.length > 0
        ? res.status(300).send(prettify({ booksByTitle: titleBooks }))
        : res
            .status(404)
            .send(
              `We currently do not have any books with the title "${title}"`,
            );
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message);
    });
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = parseInt(req.params.isbn);
  await getBooks()
    .then((list) => {
      return list[isbn]
        ? res.status(300).send(prettify(list[isbn].reviews))
        : res.status(404).send(`ISBN ${isbn} does not exist`);
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message);
    });
});

module.exports.general = public_users;
