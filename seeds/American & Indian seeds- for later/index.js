const mongoose = require('mongoose');
const AmericanCities = require('./AmericanCities');
const IndianCities = require('./IndianCities');
const { AmPlaces, AmDescriptors } = require('./AmericanSeedHelpers');
const { InPlaces, InDescriptors } = require('./IndianSeedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const AmSeedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${AmericanCities[random1000].city}, ${AmericanCities[random1000].state}`,
            title: `${sample(AmDescriptors)} ${sample(AmPlaces)}`
        })
        await camp.save();
    }
}
const InSeedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${IndianCities[random1000].city}, ${IndianCities[random1000].state}`,
            title: `${sample(InDescriptors)} ${sample(InPlaces)}`
        })
        await camp.save();
    }
}

AmSeedDB().then(() => {
    mongoose.connection.close();
})

InSeedDB().then(() => {
    mongoose.connection.close();
})