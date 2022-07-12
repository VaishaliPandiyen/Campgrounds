const express = require("express");
const router = express.Router({ mergeParams: true });
// We use mergePaarams to have access to campgrounds' :id from the URL param that we've set up for all amenities routes in the main index.js page.
const Campground = require("../models/campground");
const Amenities = require("../models/amenities");

router.post("/", async (req, res) => {
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

router.get("/new", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/amenities/new", {
    campground,
    // ,categories
  });
});

router.delete("/:a_id", async (req, res) => {
  const { id, a_id } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { amenities: a_id } });
  await Amenities.findByIdAndDelete(a_id);
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
