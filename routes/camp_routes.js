const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", async (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
  // res.redirect(`/campgrounds/${newCampground._id}/amenities/new`);
});

router.get("/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate(
    "amenities"
  );
  console.log(`Showing ${campground.title}`);
  // console.log(campground.amenities, campground.title);
  res.render("campgrounds/details", { campground });
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    { runValidators: true, new: true }
  );
  res.redirect(`/${campground._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  req.flash("success", `Successfully deleted campground`);
  res.redirect("/campgrounds");
});
// Refer to campgrounds mmodel to see middleware code to delete linked amenities

module.exports = router;
