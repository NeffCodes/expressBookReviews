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


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await getBooks()
    .then( (data) => {
      return res.status(200).send(JSON.stringify(data,null,4))
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
      if(list[isbn]){
        return res.status(300).send(JSON.stringify(list[isbn],null,4))
      } else {
        return res.status(404).send({message: `ISBN ${isbn} does not exist`})
      }
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      return res.status(err.status).send(err.message)
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
