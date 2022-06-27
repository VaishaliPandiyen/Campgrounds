const mongoose = require("mongoose");
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: Number,
  description: String,
  location: String,
  image: String,
  amenities: [{ type: Schema.Types.ObjectId, ref: "Amenities" }],
});

module.exports = mongoose.model("Campground", CampgroundSchema);
