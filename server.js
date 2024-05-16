const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON bodies
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTML Routes
// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

// Notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/notes.html"));
});

// API Routes
// Get all notes
app.get("/api/notes", (req, res) => {
  // Read the db.json file
  fs.readFile(__dirname + `/db/db.json`, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    // Send the notes data back to the client
    res.json(JSON.parse(data));
  });
});

// Post a new note
app.post("/api/notes", (req, res) => {
  // Read the db.json file
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    // Parse the data from the db.json file
    const notes = JSON.parse(data);
    // Get the new note from the request body
    const newNote = req.body;
    // Assign a unique id to the new note
    newNote.id = uuidv4();
    // Add the new note to the notes array
    notes.push(newNote);
    // Write the updated notes array to the db.json file
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        return;
      }

      res.json(newNote);
    });
  });
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  // Get the note id from the request parameters
  let noteId = req.params.id;
  // Read the db.json file
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let notes = JSON.parse(data);
    // Filter out the note with the id that matches the noteId
    notes = notes.filter((note) => note.id != noteId);
    // Write the updated notes array to the db.json file
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      // Send a response back to the client
      res.json({ ok: true });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
