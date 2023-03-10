const express = require('express');
const getUser = require('../middleware/getUser');
const Note = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');


// Route 1: Get all notes using: GET "/api/notes/getallnotes/:playlistid". Login required
// Get all notes: GET /api/notes/getallnotes/:playlistid
router.get('/getallnotes/:playlistid', getUser, async (req, res) => {
    const playlistid=req.params.playlistid;
    console.log(playlistid);
    // find all notes of the user
    const notes = await Note.find({ user: req.user.id ,playlistid:playlistid});
    if (notes.length>0) {
        // if notes found
        // send notes as response
        res.json({ success: true, message: "This route will be used to get all notes.", notes: notes });
    } else {

        // if no notes found
        res.json({ success: false, message: "No notes found" });
    }
});



// Route 2: posting a note using: POST "/api/notes/postnote". Login required
// Post a note: POST /api/notes/postnote
router.post('/postnote', getUser, [
    // validation
    body('videoId', 'Enter a valid videoId').exists()
], async (req, res) => {
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // if no errors, proceed to save note
    // destructuring the content and videoId from the request body
    const { content, videoId,title,playlistId } = req.body;

    if(content.length==0){
        return res.json({ success: false, message: "emptyNote" });
    }
    

    // check if the note already exists
    const noteExists = await Note.findOne({ user: req.user.id, videoId: videoId});

    // if note already exists, return error
    if (noteExists) {
        let note= await Note.findOne({ user: req.user.id, videoId: videoId })
        note.content=content;
        note.title=title;
        note.playlistid=playlistid;
        const updatedNote = await note.save();
        return res.json({ success: true, message: "Note updated successfully", note: updatedNote });    
    }
    // if note does not exist, save the note
    try {
        const note = new Note({
            user: req.user.id,
            content,
            videoId,
            title,
            playlistid:playlistId
        });
        const savedNote = await note.save();
        res.json({ success: true, message: "Note added successfully", note: savedNote });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
   
});

// Route 3: Update a note using: PUT "/api/notes/updatenote". Login required
// Update a note: PUT /api/notes/updatenote
router.put('/updatenote/:id', getUser, async (req, res) => {
    const { content, videoId } = req.body;
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not allowed to update this note" });
        }
        note.content = content;
        note.videoId = videoId;
        const updatedNote = await note.save();
        res.json({ success: true, message: "Note updated successfully", note: updatedNote });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route 4: Delete a note using: DELETE "/api/notes/deletenote". Login required
// Delete a note: DELETE /api/notes/deletenote
router.delete('/deletenote/:id', getUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not allowed to delete this note" });
        }
        await note.delete();
        res.json({ success: true, message: "Note deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route 5: Get a note using: GET "/api/notes/getnote". Login required
// Get a note: GET /api/notes/getnote
// router.get('/getnote/:id', getUser, async (req, res) => {
//     try {
//         let note = await Note.findById(req.params.id);
//         if (!note) {
//             return res.status(404).json({ success: false, message: "Note not found" });
//         }
//         if (note.user.toString() !== req.user.id) {
//             return res.status(401).json({ success: false, message: "Not allowed to get this note" });
//         }
//         res.json({ success: true, message: "Note fetched successfully", note: note });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// });


module.exports = router;