var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//using axios to make a ajax
var axios = require("axios");
var cheerio = require("cheerio");

//getting all the models for the database
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/articleScraper");

//Routes
app.get("/scrape", function(req,res){
  axios.get("https://www.nytimes.com/").then(function(response){
    var $ = cheerio.load(response.data);
    
    //grab first 20 every article with class "story heading"
    $(".story-heading").each(function(i, element){
      var result = {};

      if(i < 20){
        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");

        //adding the article to the mongo database
        db.Article.create(result).then(function(dbArticle){
          console.log(dbArticle);
        }).catch(function(err){
          return res.json(err);
        });
      }
    });
    //if the scrape is successful, send it to client
    res.send("Scrape successful");
  });
});

//getting all the articles
app.get("/articles", function(req, res){
  //getting all articles from the mongodb
  db.Article.find({}).then(function(dbArticle){
    res.json(dbArticle).catch(function(err){
      res.json(err);
    });
  });
});

//get a specific article
app.get("/articles/:id", function(req,res){
  db.Article.findOne({_id: req.params.id});
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

