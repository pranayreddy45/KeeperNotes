import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";
import { getCookie } from "react-use-cookie";
import { setCookie } from "react-use-cookie";
import { v4 as uuidv4 } from "uuid";

function userCookieDetails() {
  var port = process.env.PORT || 4000;
  const uuid = uuidv4();
  let cookieUserData = getCookie("userData");
  if (cookieUserData) {
    console.log(cookieUserData);
  } else {
    setCookie("userData", uuid, {
      days: 1000,
      Secure: false,
    });
    cookieUserData = uuid;
    console.log("else: " + cookieUserData);
  }

  try {
    console.log("axios post ");
    axios.post("http://localhost:" + port + "/cookie-data", {
      cookieUserData,
    });
  } catch (error) {
    console.log(error);
  }
}

function App() {
  var port = process.env.PORT || 4000;
  userCookieDetails();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    var port = 4000;
    axios.get("http://localhost:" + port + "/home").then((response) => {
      console.log("use Efect");
      setNotes(response.data);
    });
  }, []);

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    userCookieDetails();
    console.log(id);
    try {
      axios.post("http://localhost:" + port + "/delete", {
        id,
      });
    } catch (error) {
      console.log(error);
    }

    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return noteItem.id !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export { userCookieDetails };
export default App;
