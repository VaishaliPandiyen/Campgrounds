const express = require("express");
const app = express.Router();
// const app = express();

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

/*


START OF EXPRESS SESSION


*/

// "connect.sid" (session id) is the name of the cookie foe exress-session. It'll be signed.
const session = require("express-session");

app.use(
  session({
    secret: "!@#DummyPassword",
    // Like in cookie parser, it the express session will sign the cookies it sends back with this secret.
    // Inside route/middleware, on the incoming req obj, session property will be available

    // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
    resave: false,
    /* It tells the session store that a particular session is still active, which is necessary because some stores will delete idle (unused) sessions after some time. 
    If a session store driver doesn't implement the touch command, then you should enable resave so that even when a session wasn't changed during a request, it is still updated in the store (thereby marking it active). 
    So it entirely depends on the session store that you're using if you need to enable this option or not.
    Typically, you'll want false. The default is true. */
    saveUninitialized: false,
    /* If the session object isn't modified at the end of the request and when saveUninitialized is false, the (still empty, because unmodified) session object will not be stored. 
    Setting this to true will prevent empty session objects being stored. 
    Since there's nothing useful to store, the session is "forgotten" at the end of the request.
    The default is true. */
  })
);
app.get("/viewcount", (req, res) => {
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
    // this is for the first time we access the webpage in any browser/postman per session
  }
  res.send(`You have viewed this page ${req.session.count} times`);
  // For now, this info is stored in memory, not a database
});
app.get("/register", (req, res) => {
  const { username = "Anonymous" } = req.query;
  req.session.username = username;
  /* res.send(`Hi there, ${username}!`);
  
  http://localhost:3030/register?username=vaishali will show: 
  "Hi there, vaishali!"*/
  res.redirect("/welcome");
});
app.get("/welcome", (req, res) => {
  // We can access this username in a different redirected page like this:
  const { username } = req.session;
  res.send(`Hi there, ${username}!`);
  // This will work only after registering with the username
});
/*

END OF EXPRESS SESSION EXAMPLES

*/

/*

START OF FLASH EXAMPLES

// The idea of flash is a place in the session to flash a message to the user, like, success, failure, alert, etc.

*/

const flash = require("connect-flash");
app.use(flash());

app.get("/flashDemo", async (req, res) => {
  req.flash("info", "We are now using flash");
  res.redirect("/flashWelcome");
});

app.get("/flashWelcome", async (req, res) => {
  res.render("home", { messages: req.flash("info") });
  //   The "home here is the home.ejs from the views directory"

  //   Add <%= messages %> at the top of home.ejs's body for it to show as plain html at the top of the page (this is just working demo)
  //   Normally, we will have partials instead of this
});

app.use((req, res, next) => {
  // This is a middleware which gives access to messages in every single view/template
  res.locals.messages = req.flash("info");
  //   When doing this, we don't have to pass in {messages: req.flash("info")} in /flashWelcome path
  next();
});

module.exports = app;

/*

END OF FLASH EXAMPLES

*/
