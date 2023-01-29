//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser: true});

// for creating the schema for the database.
const articleSchema = {
    title: String,
    content: String
};
// here we are creating an mongoose model based on the schema which we had already created.
const Article = mongoose.model("Article" , articleSchema);

app.get("/articles" , function(req , res){

    Article.find( function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
       
    })
});

app.post("/articles" , function(req , res){
    
    const newArticle = new Article({
        title: req.body.title,
        content:req.body.content
    });
    newArticle.save( function(err){
        if(!err){
            res.send("Successfully added a new Article.");
        } else {
            res.send(err);
        }
    });
});

app.delete("/articles" , function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.")
        } else {
            res.send(err);
        }
    })
});
/////////////////////////////////////////// Request Targeting specific article /////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req ,res){
    
    Article.findOne({title: req.params.articleTitle} , function(err , foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else {
            res.send("No article matching that title.")
        }
    })
})
// Now to update one article we don't need to overwrite in MongoDB.
.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        { title: req.body.title, content : req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated the article");
            } else {
                console.log(err);
            }
        }
    );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});