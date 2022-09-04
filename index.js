const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");

const camp = require("./routes/camp_routes");
const amenity = require("./routes/amenity_routes");
const explainers = require("./routes/explainers");

const session = require("express-session");
app.use(
  session({
    secret: "campUser$%^",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 1,
      // millisecs * secs * mins * hrs
      maxAge: 1000 * 60 * 60 * 1,
      // There is no default expiration
      httpOnly: true,
      // This is basic security
    },
  })
);
// For 1. using flash; 2. session access for auth.

const flash = require("connect-flash");
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/YelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  // to make Mongoose deprecation warning go away
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected successfully");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
// This is to serve the static assets like CSS and JS files from the public directory
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.render("campgrounds/landing");
});

app.use("/campgrounds", camp);
app.use("/campgrounds/:id/amenities", amenity);
app.use("", explainers);

// app.get("/sampleCampground", async (req, res) => {
//   const camp1 = new Campground({
//     title: "Elliots Beach retro",
//     price: 100,
//     description: "No fishing allowed",
//     location: "Elliots Beach, Chennai",
//   });
//   await camp1.save();
//   res.send(camp1);
// });

app.listen(3030, () => {
  console.log("Local app running on port 3030");
});
