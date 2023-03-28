import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { userCookieDetails } from "./App";

function CreateArea(props) {
  let origin = window.location.origin;
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    id: "",
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    const uuid = uuidv4();
    const id = "id";

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
        [id]: uuid,
      };
    });
  }

  function submitNote(event) {
    // var port = 5000;
    userCookieDetails();
    if (note.title === "" && note.content === "") {
      console.log("Please fill something");
    } else {
      try {
        //console.log("Submit Note: " + note.id);
        axios.post(origin + "/post_name", {
          note,
        });
      } catch (error) {
        console.log(error);
      }

      props.onAdd(note);
      setNote({
        id: "",
        title: "",
        content: "",
      });
    }
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
