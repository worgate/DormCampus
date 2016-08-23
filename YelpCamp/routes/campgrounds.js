var express =   require("express");
var router  =   express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware");

//INDEX - Show all campgrounds 
router.get("/",function(req, res){
    // get all campgrounds from DB
    // console.log(req.user);
    Campground.find({},function(err, allcampgrounds){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/index",{campgrounds: allcampgrounds});
       }
    });
});


//CREATE  - add new campgrounds to DB
router.post("/", middleware.isLoggedIn,function(req, res){
        //get data from from and add to campsgrounds array
        var name = req.body.name;
        var image = req.body.image;
        var desc = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        var newCampground = {name: name, image: image, description: desc, author:author}
        //create a new camp and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log("err");
            }else{
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });

});


//NEW - show form to create new campground 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new") 
});


//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT - campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
                Campground.findById(req.params.id, function(err, foundCampground){
                    if(err){
                        res.redirect("back");
                    }else{
                        res.render("campgrounds/edit", {campground: foundCampground});
                    }
                });
 
        //does user own the campground
        //otherwise , redirect
    // if not, redirect
    
            //   res.send("EDIT CAMPGROUNds") 
 
});
//UPDATE - campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
      //find and update the correct camp
      //   var data = {name: req.body.name..}
      //  or grouping into single object
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
         if(err){
             console.log(err);
             res.redirect("/campgrounds");
             
         } else{
             console.log(updatedCampground);
             // redirect
             res.redirect("/campgrounds/"+req.params.id);
         }
      });
      
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",  middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   })
});



//middleware 




module.exports = router;