const express = require("express");
const app = express();

const path = require("path");
const Campground = require("./models/campground");
const Amenities = require("./models/amenities");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/YelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.render("campgrounds/landing");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  res.render("campgrounds/newAmenities");
});

app.post("/amenities", async (req, res) => {
  const newAmenities = new Amenities(req.body);
  await newAmenities.save();
  res.redirect("/campgrounds")
  // res.redirect(`/campgrounds/${newCampground._id}`);
});
app.get("/campgrounds/amenities", async (req, res) => {
  res.render("campgrounds/newAmenities");
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/details", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    { runValidators: true, new: true }
  );
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.get("/sampleCampground", async (req, res) => {
  const camp1 = new Campground({
    title: "Elliots Beach retro",
    price: 100,
    description: "No fishing allowed",
    location: "Elliots Beach, Chennai",
  });
  await camp1.save();
  res.send(camp1);
});

app.listen(3030, () => {
  console.log("On port 3030");
});
