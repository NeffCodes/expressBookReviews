const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
    return await new Promise((resolve, reject) => {
      try{
          const data = books;
          resolve(data)
      }catch(err){
          reject(err)
      }
    });
};

const prettify = (msg) => JSON.stringify(msg, null, 4)

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await getBooks()
    .then( (data) => {
      return res.status(200).send(prettify(data))
    })
    .catch( (err) => {
      console.error(err);
      return res.status(500).send({message: 'Internal server error'})
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = parseInt(req.params.isbn);
  await getBooks()
    .then((list) => {
      return list[isbn] ?
        res.status(300).send(prettify(list[isbn])) :
        res.status(404).send(`ISBN ${isbn} does not exist`)
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message)
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  await getBooks()
    .then((list) => {
      //get isbn keys
      const listKeys = Object.keys(list);

      //find books by author
      const authorsBooks = [];
      for(key of listKeys){
        if(list[key].author === author) {
          authorsBooks.push({
            "isbn": key,
            "title": list[key].title,
            "reviews": list[key].reviews,
          })
        }
      }

      return authorsBooks.length > 0 ?
        res.status(300).send(prettify({"booksByAuthor":authorsBooks})) :
        res.status(404).send(`We currently do not have any books by ${author}`)
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message)
    })
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  await getBooks()
    .then((list) => {
      //get isbn keys
      const listKeys = Object.keys(list);

      //find books by title
      const titleBooks = [];
      for(key of listKeys){
        if(list[key].title === title) {
          titleBooks.push({
            "isbn": key,
            "author": list[key].author,
            "reviews": list[key].reviews,
          })
        }
      }

      return titleBooks.length > 0 ?
        res.status(300).send(prettify({"booksByTitle":titleBooks})) :
        res.status(404).send(`We currently do not have any books with the title "${title}"`)
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message)
    })
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = parseInt(req.params.isbn);
  await getBooks()
    .then((list) => {
      return list[isbn] ?
        res.status(300).send(prettify(list[isbn].reviews)) :
        res.status(404).send(`ISBN ${isbn} does not exist`)
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message)
    })
});

module.exports.general = public_users;
