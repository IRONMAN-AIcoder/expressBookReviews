const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    if(!username||!password){
        return res.status(400).json({message:"No Username or Password"});
   
    }
    const userexist= users.find(user=>user.username===username);
    if(userexist)
    {
        return res.status(400).json({message:"User Exists!"});

    }
    users.push({username,password});
    return res.status(200).json({message:"User Registered Successfully"});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  let details=books[isbn];
  if(details){
    return res.status(200).json(details);
  }
  else{
    return res.status(404).json({message:"No book in this isbn!"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;
    const keys=Object.keys(books);
    let result=[];
    for(let i=0;i<keys.length;i++)
    {
        const book=books[keys[i]];
        if(book.author.toLowerCase()===author.toLowerCase())
        {
            result.push(book);
        }
    }
    if(result.length>0){
        return res.status(200).json(result);
    }
    else{
        return res.send(404).json({message:"No book in this author's name is found!"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    const keys=Object.keys(books);
    let result=[];
    for(let i=0;i<keys.length;i++)
    {
        const book=books[keys[i]];
        if(book.title.toLowerCase()===title.toLowerCase())
        {
            result.push(book);
        }
    }
    if(result.length>0){
        return res.status(200).json(result);
    }
    else{
        return res.send(404).json({message:"No book found with this title!" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 const isbn=req.params.isbn;
const book=books[isbn];
if(!book){
    return res.status(404).json({message : "No book is present with this isbn number!"});
}
const reviews=book.reviews;
if(Object.keys(reviews).length>0)
{
    return res.status(200).json(reviews);
}
return res.status(404).json({message:"No reviews for this book"});
});

module.exports.general = public_users;
