const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const cost = Math.floor(Math.random() * 300);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price: cost,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/1846775",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, dolorum. Facere quisquam quas ipsa eaque deleniti iusto provident aliquam maiores corporis omnis perspiciatis dolorem, repudiandae odit praesentium, adipisci tenetur fuga.",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
