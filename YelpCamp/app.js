var  express    = require("express"),
     app        = express(),
     bodyParser = require("body-parser"),
     mongoose   = require("mongoose"),
     flash      = require("connect-flash"),
     passport   = require("passport"),
     LocalStrategy = require("passport-local"),
     methodOverride = require("method-override"),
     Campground = require("./models/campground"),
     Comment    = require("./models/comment"),
     User       = require("./models/user"),
     seedDB     = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

//var url =  "mongodb://chinwat:H@ppy2560@ds011933.mlab.com:11933/yelpcamp";
//process.env.DATABASEURL ||"mongodb://localhost/yelp_camp";
mongoose.connect("mongodb://localhost/yelpcamp");
console.log("database pass");
//console.log(process.env.DATABASEURL);

//mongoose.connect("mongodb://chinwat:rusty@ds011933.mlab.com:11933/yelpcamp");
//  mongodb://chinwat:H@ppy2560@ds011933.mlab.com:11933/yelpcamp
//mongodb://localhost/yelp_camp

//$ heroku config:set DATABASEURL=mongodb://chinwat:rusty@ds011933.mlab.com:11933/yelpcamp


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// SEED DATABASE
// seedDB();


//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//authenticate from UserSchema.plugin(passportLocalMongoose);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



// (get)campnew -> new(post) -> (post)campground -> (get)campgrounds
app.listen(8080, '10.132.71.219',function(){
    console.log("YelpCamp Server Has Started!");
});
