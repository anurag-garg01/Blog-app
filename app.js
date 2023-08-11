
//jshint esversion:6
 
//requiring the modules : 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
main().catch((err) => console.log("err"));
const homeStartingContent = "Ambition and determination are the key ingredients that fuel success. Stay focused on your goals, driven by your passion, and let your determination guide you to the heights of achievement.";
const aboutContent = "This is a blog website created by Anurag Garg as a part of Web Development Course on Udemy by Angela Yu";
const contactContent = "Contact me at garganurag3955@gmail.com for queries!";
 
const app = express();

//Added by me which is not present in Lecture(IMP !!!!!)
const request = require("request");
const cors = require('cors')
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors())
// require these installations for env file to protect password(IMP!!!!!)
//npm i require body-parser cors dotenv


 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
 
//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

// async function main() {
//   const MONGODB_URI = process.env.MONGODB_URI;
//   await mongoose.connect(MONGODB_URI);
// }
 
//Creating an empty array but we are not using it in this version of the app.
// const posts = [];
 
 
//Creating Schema for the posts 
const postSchema = new mongoose.Schema({
  title : String,
  content: String,
});
 
 
//Creating a mongoose model based on this Schema :
 
const Post = mongoose.model("Post",postSchema);
 
//Adding delete button by PostId requirements
const ObjectId = require("mongoose").Types.ObjectId;
//
app.get("/", function(req, res) {
 
  // Find all items in the Posts collection and render it into our home page.
 Post.find().then(posts =>{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
});
 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
 
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
 
app.get("/compose", function(req, res){
  res.render("compose");
 
 });
 
 //Saved the title and the post into our blogDB database.
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
 
  //We are saving the post through our compose route and redirecting back into the home route. A message will be displayed in our console when a post is being saved.
 
  post.save().then(() => {
 
    console.log('Post added to DB.');
 
    res.redirect('/');
 
  })
 
  .catch(err => {
 
    res.status(400).send("Unable to save post to database.");
 
  });
 
 
});
 
app.get("/posts/:postId", function(req, res){
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;


 
  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.
 
  Post.findOne({_id:requestedPostId})
  .then(function (post) {
    res.render("post", {
            title: post.title,
            content: post.content,
            post:post,
          });
    })
    .catch(function(err){
      console.log(err);
    })
 
 
});
 


//delete post
app.get("/delete/:postId", (req, res) => {
  const postId = req.params.postId;
  // console.log(postId);
  Post.findByIdAndRemove({ _id: postId })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});


app.post("/delete", function(req, res) {
  const postId = req.body.postId;
  
  Post.findByIdAndRemove(postId, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted the post.");
      res.redirect("/");
    }
  });
});





//To choose deafault port provided by hosting platform
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("Server is running on port 3000 or " + port);
});