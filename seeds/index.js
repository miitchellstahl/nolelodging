const express = require("express");
const { mongoose } = require("mongoose");
const dormList = require("./dormInfoArray");
const Dorm = require("../models/dorm");

mongoose.connect("mongodb://localhost:27017/nole-lodging", {
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
