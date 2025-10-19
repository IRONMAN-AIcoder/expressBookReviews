const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return users.find(user=>user.username===username);
}

const authenticatedUser = (username,password)=>{ 
    const user = users.find(user => user.username === username && user.password === password);
    return user ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    if(!username||!password)
    {
        return res.status(404).json({message:"Error logging in!"});
    }
    if(authenticatedUser(username,password))
    {
       let accessToken=jwt.sign(
            {data:password},'access',{expiresIn:60*60}
        );
        req.session.authorization={accessToken,username};
        return res.status(200).json({message:"User logged in!"});
    }
    else {
        return res.status(401).json({ message: "Invalid Login! Please register first." });
      }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 const isbn=req.params.isbn;
 const review=req.query.review;

 const username=req.session.authorization?.username;
 if(!username){
    return res.status(401).json({message:"User not logged in!"});
 }
 if(!books[isbn]){
    return res.status(404).json({message:"No Book is found with this isbn number!"});
 }
 if(!review){
    return res.status(400).json({message:"No reviews for this book!"});
 }
 books[isbn].reviews[username]=review;
 return res.status(200).json({message:`Review for book with ISBN ${isbn} has been added/updated by ${username}`,reviews: books[isbn].reviews});
 
});
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn=req.params.isbn;
    const username=req.session.authorization?.username;
    if(!username){
        return res.status(401).json({message:"User not logged in!"});
     }
     if(!books[isbn]){
        return res.status(404).json({message:"No Book is found with this isbn number!"});
     }
     if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found from this user for this book." });
    }
     delete books[isbn].reviews[username];
     return res.status(200).json({message:`Review by '${username}' for book with isbn ${isbn} has been deleted!`});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
