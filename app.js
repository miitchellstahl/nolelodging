//Initialize Variables and Dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: "/config.env" });

const methodOverride = require("method-override");
const Dorm = require("./models/dorm");
const dormInfoArray = require("./seeds/dormInfoArray");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/expressError");

//Connect to database
const MONGOURI = process.env.MONGO_URI;

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Databse Connected.");
});

//Initialize Express
const app = express();

//Set view engines to EJS and setup a static directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Home route
app.get("/", async (req, res) => {
  let option = "Name";
  const dorms = await Dorm.find({});
  res.render("dorms/index", { dorms, option });
});

//Privacy route
app.get("/privacy", async (req, res) => {
  res.render("dorms/privacypolicy");
});

//About route
app.get("/about", async (req, res) => {
  res.render("dorms/about");
});

//Sends info from home page form and analyzes the info to return filtered dorms
app.post("/", async (req, res) => {
  const {
    name,
    residentslow,
    residentshigh,
    yearlow,
    yearhigh,
    floorlow,
    floorhigh,
    toprated,
  } = req.body;
  let option = "Name";

  //Filter the dorms
  if (name) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    option = "Name";
    res.render("dorms/index", { dorms, option });
  } else if (residentslow) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ capacity: 1 });
    option = "Residents (Low to High)";
    res.render("dorms/index", { dorms, option });
  } else if (residentshigh) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ capacity: -1 });
    option = "Residents (High to Low)";
    res.render("dorms/index", { dorms, option });
  } else if (yearlow) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ year: 1 });
    option = "Age (Low to High)";
    res.render("dorms/index", { dorms, option });
  } else if (yearhigh) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ year: -1 });
    option = "Age (High to Low)";
    res.render("dorms/index", { dorms, option });
  } else if (floorlow) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ floors: 1 });
    option = "Floors (Low to High)";
    res.render("dorms/index", { dorms, option });
  } else if (floorhigh) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ floors: -1 });
    option = "Floors (High to Low)";
    res.render("dorms/index", { dorms, option });
  } else if (toprated) {
    let dorms = await Dorm.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ overallRating: -1 });
    option = "Top Rated";
    res.render("dorms/index", { dorms, option });
  } else {
    const dorms = await Dorm.find({});
    res.render("dorms/index", { dorms, option });
  }
});

//Queries Mongo based on seaerch results and renders the filtered dorms
app.post("/results", async (req, res) => {
  let { name } = req.body;
  name = name.trim();
  console.log(name);
  let dorms = await Dorm.find({
    name: { $regex: new RegExp(name, "i") },
  });
  res.render("dorms/results", { dorms, name });
});

//Queries a specific dorm and renders the dorm page
app.get(
  "/:id",
  catchAsync(async (req, res) => {
    const dorm = await Dorm.findById(req.params.id);
    res.render("dorms/show", { dorm });
  })
);

//Finds the dorm and renders the add review page
app.get(
  "/:id/add-review",
  catchAsync(async (req, res) => {
    const dorm = await Dorm.findById(req.params.id);
    res.render("dorms/add-review", { dorm });
  })
);

//Average review variables
let overallRating = 0,
  averageLocation = 0,
  averageSize = 0,
  averageSocial = 0,
  averageNoise = 0,
  averageProximity = 0,
  counter = 0;

let review = 0;

//Receives review data from dorm page and calculates the overall rating, redirects to main dorm page
app.post("/:id/add-review", async (req, res) => {
  const dorm = await Dorm.findById(req.params.id);
  //   res.render("dorms/add-review", { dorm });
  let { grade, location, size, social, proximity, noise, message } = req.body;
  dorm.review += 1;
  let reviewNum = 0;
  reviewNum = dorm.review + 1;
  console.log("REVIEWNUM " + reviewNum);
  dorm.reviews.push({
    grade,
    location,
    size,
    social,
    proximity,
    noise,
    message,
  });

  await dorm.save();

  if (review == 0) {
    console.log("sdjfn");
  } else {
    location = parseInt(location);
    size = parseInt(size);
    social = parseInt(social);
    proximity = parseInt(proximity);
    noise = parseInt(noise);

    console.log(typeof location);

    // averageLocation += location;
    // averageSize += size;
    // averageSocial += social;
    // averageNoise += noise;
    // averageProximity += proximity;

    console.log(averageLocation);

    averageLocation = averageLocation;
    averageSize = averageSize;
    averageSocial = averageSocial;
    averageNoise = averageNoise;
    averageProximity = averageProximity;

    // averageLocationDivide /= review;
    // averageSizeDivide /= review;
    // averageSocialDivide /= review;
    // averageNoiseDivide /= review;
    // averageProximityDivide /= review;
    overallRating = parseFloat(
      (
        (averageLocation / reviewNum +
          averageSize / reviewNum +
          averageSocial / reviewNum +
          averageNoise / reviewNum +
          averageProximity / reviewNum) /
        5
      ).toFixed(1)
    );

    console.log(overallRating);

    dorm.overallRating = overallRating;
    await dorm.save();
  }

  res.redirect(`/${dorm._id}`);
});

//Catch all middleware
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No! Something Went Wrong.";
  //   res.status(statusCode).render("fck");
  res.render("dorms/error");
});

//Server setup
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Serving on port 3000");
});
