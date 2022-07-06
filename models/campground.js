const mongoose = require("mongoose");
const Amenities = require("./amenities");
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

//
// Using a mongoose middleware to delete the related amenities when the campground is deleted:

// We will use findOneAndDelete mongoose middleware here because we use findByIdAndDelete express function there. Refer to the mongoose middleware docs > model to find the correct mongoose middleware according to express funtion

CampgroundSchema.post("findOneAndDelete", async (camp) => {
  // no need to call next() in mongoose middleware (different from express middleware)
  if (camp.amenities.length > 0) {
    const deleteAmenities = await Amenities.deleteMany({
      _id: { $in: camp.amenities },
    });
    // $in: means "is within the collection"
    console.log(`Deleted ${camp.title}`);
  } else {
    console.log(`Deleted ${camp.title} (no extra amenities)`);
  }

  // console.log(camp);

  // In pre-middleware, since we won't have access to the camp which is being deleted, the console would show [function]. But in post-middleware, the console will show the document of the campground selected to delete, i.e., {title: .....}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
