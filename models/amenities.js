const mongoose = require("mongoose");
const { Schema } = mongoose;

const AmenitiesSchema = new Schema({
  facility: {
    type: String,
    required: true,
    enum: [
      "None",
      "Bonfire",
      "Hiking",
      "Trekking",
      "Cannoeing",
      "Yoga and Wellness",
      "Non-processed food",
      "Safari",
    ],
  },
  conductor: {
    type: String,
    required: true,
    enum: ["Available", "N/A", "Not-Available", "Bring your own"],
  },
  equipments: {
    type: String,
    required: true,
    enum: ["Available", "N/A", "Not-Available", "Bring your own"],
  },
  trail: {
    type: String,
    required: true,
    enum: ["Available", "N/A", "Not-Available"],
  },
  guides: {
    type: String,
    required: true,
    enum: ["Available", "N/A", "Not-Available"],
  },
  things_to_carry: String,
  contact_person: {
    type: String,
    // required: true,
  },
  contact_number: {
    type: Number,
    // required: true,
  },
  campground: [{ type: Schema.Types.ObjectId, ref: "Campground" }],
});

module.exports = mongoose.model("Amenities", AmenitiesSchema);
