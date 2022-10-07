const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../config.env" });
const dormList = require("./dormInfoArray");
const Dorm = require("../models/dorm");

const MONGOURI = process.env.MONGO_URI;

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Databse Connected.");
});

const seedDB = async () => {
  await Dorm.deleteMany({});
  for (let i = 0; i < dormList.length; i++) {
    const dorm = new Dorm(dormList[i]);
    console.log(dorm);
    await dorm.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
