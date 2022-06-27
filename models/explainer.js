const mongoose = require("mongoose");
const { Schema } = mongoose;

// ONLY REQUIRED IF THIS MODEL IS USED SEPARATELY IN A FRESH DIRECTORY

// mongoose.connect("mongodb://localhost:27027/explainerDemo", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "Connection Error"));
// db.once("open", () => {
//   console.log("Database Connected!");
// });

// END OF CONNECTION CODE

/* 
    GOOD PRACTICES
*/

// Refer to schemeDesignGuide.txt file in this directory for good practices info and connection to the above codes.

/* 


*/
const ONE_TO_FEW = "";
/* 


*/

const oneToFewSchema = new Schema({
  place: {
    type: String,
    required: true,
  },
  state: String,
  country: String,
  location: {
    type: Map,
    // required: true,
  },
  landmarks: [
    {
      name_of_landmark: String,
      landmark_location: Map,
      distance_from_location: String,
    },
  ],
});

const OneToFew = mongoose.model("OneToFew", oneToFewSchema);

// TO MAKE A NEW PLACE :

const makeNew = async () => {
  const first = new OneToFew({
    place: "Good home animal shelter",
    state: "Kerala",
    country: "India",
  });
  first.landmarks.push({
    name_of_landmark: "Near SBI Main branch",
    distance_from_location: "200 metres",
  });
  //   const result = await first.save();
  //   console.log(result);
};
// makeNew();

let dummy1;

// 1. Landmarks will get a new ID too.
// (It can be turned off by adding <_id:{id: false},> in the schema- not in the new document we're making)

// 2. Mongoose treats the Landmarks document as its own embedded schema.

// 3. We can "add by id" too by adding id as params in async(id), and  <const x = await OneToFew.findById(id)> before <first.landmarks.push>.

/* 


*/
const ONE_TO_MANY = "";
/* 


*/

const oneToManyStudentSchema = new Schema({
  name: String,
  place: String,
  subject: {
    type: String,
    enum: ["Maths", "Science", "Social Science"],
    // enum shows acceptable choices
  },
});
const oneToManyProjectSchema = new Schema({
  title: String,
  summary: String,
  students: [{ type: Schema.Types.ObjectId, ref: "OneToManyStudent" }],
  // adding reference to ObjectId of the document's model we'll be referencing to bring in here.
});

const OneToManyStudent = mongoose.model(
  "OneToManyStudent",
  oneToManyStudentSchema
);
const OneToManyProject = mongoose.model(
  "OneToManyProject",
  oneToManyProjectSchema
);

// ! Do this before writing the oneToManyProjectSchema:

// OneToMany.insertMany([
//   { name: "A", place: "Sigma", subject: "Science" },
//   { name: "B", place: "Delta", subject: "Maths" },
//   { name: "C", place: "Omega", subject: "Science" },
//   { name: "D", place: "Phi", subject: "Maths" },
// ]);

const newProject = async () => {
  const Project = new OneToManyProject({
    title: "Pythogorean Game of Chances",
    summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  });
  const Student = await OneToManyStudent.findOne({ name: "D" });
  //   Project.students.push(Student);
  //   console.log(Project);
};
// newProject();

let dummy2;

// // This will give us {
// students: [
//   { _id: xxxxxxxxxxxxx, name: "D", place: "Phi", subject: "Maths" },
// ],
// _id: yyyyyyyyyyyyyy,
// title: "Pythogorean Game of Chances",
// summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
// } in the NODE TERMINAL/CLI. Mongoose gives us this in Javascript.

// If we do <await Project.save()> before console.log(Project),
//  students: [ ObjectId("xxxxxxxxxxxxx")] after the _id instead in the MONGO SHELL.

const addStudent = async () => {
  const Project = await OneToManyProject.findOne({
    title: "Pythogorean Game of Chances",
  });
  const Student = await OneToManyStudent.findOne({ name: "B" });
  //   Project.students.push(Student);
  //   await Project.save();
  //   console.log(Project);
};
// addStudent();

let dummy3;

// Now <students: []> will have two ObjectIds like this:
// students: [ ObjectId("xxxxxxxxxxxxx"), ObjectId("xyxxxxyxxxxxy")] in MONGO SHELL
//  students: [ xxxxxxxxxxxxx, xyxxxxyxxxxxy] in the NODE TERMINAL/CLI.

OneToManyProject.findOne({ title: "Pythogorean Game of Chances" })
  .populate("students")
  .then((project) => console.log(project));

// This gives students info in the project object:
// students: [
//   {
//     _id: xxyyxxyz,
//     name: "B",
//     place: "Delta",
//     subject: "Maths",
//     __v: 0,
//   },
//   {
//     _id: xyxyxxzx,
//     name: "D",
//     place: "Phi",
//     subject: "Maths",
//     __v: 0,
//   },
// ];
// For this, the  ref: "OneToManyStudent"  is needed in the oneToManyProjectSchema

/* 


*/
const ONE_TO_BAJILLIONS = "";
/* 


*/

// In ONE TO MANY, we stored a reference to the child (student) on the parent (project)
// In ONE TO BAJILLIONS, we will store a reference to the parent (user) on the child (tweet) instead!

const oneToBajUserSchema = new Schema({
  userName: String,
  location: String,
});
const oneToBajTweetSchema = new Schema({
  text: String,
  likes: Number,
  user: [{ type: Schema.Types.ObjectId, ref: "OneToBajUser" }],
});

const OneToBajUser = mongoose.model("OneToBajUser", oneToBajUserSchema);
const OneToBajTweet = mongoose.model("OneToBajTweet", oneToBajTweetSchema);

const addTweet = async () => {
  const user = new OneToBajUser({
    userName: "Mad_Mac305",
    location: "Bahrain",
  });
  const tweet_1 = new OneToBajTweet({
    text: "Hello World :P",
    likes: 23,
  });
  tweet_1.user = user;

  // This sets the "user" property/key in the tweet document to the "const user" that we defined above it.

  //   const result_1 = await user.save();
  //   const result_2 = await tweet_1.save();
  //   console.log(result_1);
  //   console.log(result_2);
};
// addTweet();

let dummy4;

// We'll get <"user": ObjectId("xrdctfygbhuj")>

// We can do const user = await OneToBajUser.findOne({userName: "Mad_Mac305"}) and a const tweet_2 too! Here, we won't have to do user.save()

// To add the userName alone (without the location), we can chain on the sub-property/key name (userName from OneToBajUser) in the populate() method after the main-property/key name (user from OneToBajTweet) like this:

const findTweet = async () => {
  const tw = await OneToBajTweet.findOne().populate("user", "userName");
  console.log(tw);
};
// findTweet();

let dummy5;
