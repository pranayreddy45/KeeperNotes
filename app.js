require("dotenv").config();
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
app.use(express.static("keeper-app-frontend/build"));

mongoose.connect(
  `mongodb+srv://admin-pranay:adminpranay123@cluster0.aew4g.mongodb.net/keeperApp`,
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

// app.get("/", (req, res) => {
//   res.sendFile("/index.html");
// });

app.post("/cookie-data", async (req, res) => {
  // console.log(req.body);
  cookieUserData = req.body.cookieUserData;

  let existKeeperAppCookie = await keeperAppCookie.findOne({
    cookieValue: cookieUserData,
  });
  if (!existKeeperAppCookie) {
    let newCookieUserData = new keeperAppCookie({
      cookieValue: cookieUserData,
    });

    await newCookieUserData
      .save()
      .then(() => {
        console.log("Inserted Sucessfully");
        return res.status(200).send("Inserted Sucessfully");
      })
      .catch((err) => {
        console.log("err line 65: " + err);
        return res.status(400).send(err);
      });
  } else {
    console.log("Cookie line 68: " + existKeeperAppCookie);
    return res.status(200).send("found cookie");
  }

  //   keeperAppCookie.find({ cookieValue: cookieUserData }, (err, docs) => {
  //     if (docs.length === 0) {
  //       keeperAppCookie.insertMany([{ cookieValue: cookieUserData }], (error) => {
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           console.log("Cookie Value inserted Sucessfully");
  //         }
  //       });
  //     } else {
  //       // console.log("else: " + docs);
  //     }
  //   });
});

app.get("/home", async (req, res) => {
  let existUserCookieValue = await KeeperApp.find({
    userCookieValue: cookieUserData,
  });

  if (existUserCookieValue) {
    return res.status(200).send(existUserCookieValue);
  } else {
    console.log("Line 88 else ");
  }
  //   KeeperApp.find({ userCookieValue: cookieUserData }, (err, foundItems) => {
  //     res.send(foundItems);
  //   });
});

app.post("/post_name", (req, res) => {
  let { note } = req.body;
  console.log("Name is: " + note.id + " " + note.title + " " + note.content);

  let newNotesInsertMany = new KeeperApp({
    id: note.id,
    title: note.title,
    content: note.content,
    userCookieValue: cookieUserData,
  });

  newNotesInsertMany
    .save()
    .then(() => {
      console.log("Notes Inserted Sucessfuly");
      return res.status(200).send("Notes Inserted Sucessfully");
    })
    .catch((err) => {
      console.log("err line 118: " + err);
      return res.status(400).send(err);
    });

  //   KeeperApp.insertMany(
  //     [
  //       {
  //         id: note.id,
  //         title: note.title,
  //         content: note.content,
  //         userCookieValue: cookieUserData,
  //       },
  //     ],
  //     (error) => {
  //       if (error) console.log(error);
  //       else console.log("Inserted Sucessfully.");
  //     }
  //   );
});

app.post("/delete", (req, res) => {
  let { id } = req.body;
  KeeperApp.deleteOne({ id: id })
    .then(() => {
      console.log("Deleted Sucessfullu");
      return res.status(200).json({ message: "deleted Sucessfully" });
    })
    .catch((error) => {
      console.log("Delete Error: " + error);
      return res.status(400).json({ message: "Not deleted" });
    });
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/keeper-app-frontend/build/index.html");
});

var port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("keeper-app-frontend/build"));
}

app.listen(port, () => {
  console.log("Running on Port" + port);
});
