const express = require("express");
const app = express();

const path = require("path");
const Campground = require("./models/campground");
const Amenities = require("./models/amenities");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");
const amenities = require("./models/amenities");
mongoose.connect("mongodb://localhost:27017/YelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
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
  res.redirect(`/campgrounds/${newCampground._id}`);
  // res.redirect(`/campgrounds/${newCampground._id}/amenities/new`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate(
    "amenities"
  );
  console.log(`Showing ${campground.title}`);
  // console.log(campground.amenities, campground.title);
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
// Refer to campgrounds mmodel to see middleware code to delete linked amenities

/*  


// AMENITIES


*/

app.post("/campgrounds/:id/amenities", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  // we just linked the campgrond to the amenities db
  const amenities = new Amenities(req.body.amenities);
  campground.amenities.push(amenities);
  // We just pushed the new input amenities info into the campground db
  amenities.campground = campground;
  // We have linked the campground info to the amenities db
  if (amenities.facility != "None") {
    await amenities.save();
    await campground.save();
    console.log(`${amenities.facility} added to ${campground.title}`);
  } else {
    console.log(`No amenity added to ${campground.title}`);
  }
  // We saved the input amenities info to the amenities db and updated the campground db with the same
  // console.log(amenities.facility);
  res.redirect(`/campgrounds/${id}`);
  // res.send(campground);
});
app.get("/campgrounds/:id/amenities/new", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/amenities/new", {
    campground,
    // ,categories
  });
});
app.delete("/campgrounds/:id/amenities/:a_id", async (req, res) => {
  const { id, a_id } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { amenities: a_id } });
  await Amenities.findByIdAndDelete(a_id);
  res.redirect(`/campgrounds/${id}`);
});

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
