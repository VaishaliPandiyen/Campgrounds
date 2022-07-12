const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const camp = require("./routes/camp_routes");
const amenity = require("./routes/amenity_routes");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  // to make Mongoose deprecation warning go away
});

// In Chrome Dev tools, see cookies in application tab.

const cookieParser = require("cookie-parser");
app.use(cookieParser("Vaishali's_Cookie_#r53et6q23ftwqyshg"));
/* 
This param is the secret sign used to sign the cookies and verify when we get them back. In real workd, it'll be hidden/env variable.
If we change the secret, the existing cookies become invalid.

COOKIE EXAMPLES :

*/
app.get("/cookieExampleLogIN", async (req, res) => {
  res.cookie("loggedIn", "true");
  //   the above line saves logged in status
  res.send("Logged-in!");
});
app.get("/cookieExampleLogOUT", async (req, res) => {
  res.cookie("loggedIn", "false");
  //   the above line saves logged in status
  res.send("Logged-out!");
});
app.get("/cookieExampleLogStatus", async (req, res) => {
  const { loggedIn } = req.cookies;
  //   the above line accesses saved cookie data to show in this page
  res.send(`Hey there! Your logged in status is ${loggedIn}`);
});

/* Signing is verifying something's authenticity (unchanges original source) and integrity (that something hasn't changed- like wax seal/don't buy if the seal is broken label)
Similarly, we can have signed cookies using a secret code. It's to make sure that no one tampered with the original data sent.
*/

app.get("/signedCookieExampleCouponCode", async (req, res) => {
  res.cookie("lastHr30%offCode", "haytreat0456#!5632tt", { signed: true });
  res.send("Download your coupon here.");
  console.log(req.signedCookies);
  // this is how you access signed cookies
  // tampering with it in application tab will show "lastHr30%offCode":false
});

/*

END OF COOKIE EXAMPLES

*/

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
app.use("/campgrounds/:id/amenitie", amenity);

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
