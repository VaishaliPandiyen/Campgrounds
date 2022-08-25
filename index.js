const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const camp = require("./routes/camp_routes");
const amenity = require("./routes/amenity_routes");
const explainers = require("./routes/explainers");

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
