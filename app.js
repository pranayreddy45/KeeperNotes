const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const _ = require("lodash");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://admin-pranay:adminpranay123@cluster0.aew4g.mongodb.net/keeperApp",
  {
    useNewUrlParser: true,
  }
);

const keeperAppCookieSchema = new mongoose.Schema({
  cookieValue: String,
});

const keeperAppCookie = mongoose.model("usercookie", keeperAppCookieSchema);

const keeperAppSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  userCookieValue: String,
});

const KeeperApp = mongoose.model("note", keeperAppSchema);

let cookieUserData = "";

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.post("/cookie-data", (req, res) => {
  // console.log(req.body);
  cookieUserData = req.body.cookieUserData;
  keeperAppCookie.find({ cookieValue: cookieUserData }, (err, docs) => {
    if (docs.length === 0) {
      keeperAppCookie.insertMany([{ cookieValue: cookieUserData }], (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Cookie Value inserted Sucessfully");
        }
      });
    } else {
      // console.log("else: " + docs);
    }
  });
});

app.get("/home", (req, res) => {
  KeeperApp.find({ userCookieValue: cookieUserData }, (err, foundItems) => {
    res.send(foundItems);
  });
});

app.post("/post_name", (req, res) => {
  let { note } = req.body;
  console.log("Name is: " + note.id + " " + note.title + " " + note.content);
  KeeperApp.insertMany(
    [
      {
        id: note.id,
        title: note.title,
        content: note.content,
        userCookieValue: cookieUserData,
      },
    ],
    (error) => {
      if (error) console.log(error);
      else console.log("Inserted Sucessfully.");
    }
  );
});

app.post("/delete", (req, res) => {
  let { id } = req.body;
  KeeperApp.deleteOne({ id: id })
    .then(() => {
      console.log("Deleted Sucessfullu");
    })
    .catch((error) => {
      console.log("Delete Error: " + error);
    });
});

var port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("keeper-app-frontend/build"));
}

app.listen(port, () => {
  console.log("Running on Port" + port);
});
