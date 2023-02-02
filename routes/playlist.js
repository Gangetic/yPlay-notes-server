const express = require('express');
const getUser = require('../middleware/getUser');
const Playlist = require('../models/playlist');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Route 1: Get all notes using: GET "/api/playlist/getallplaylist". Login required

router.get('/getallplaylist', getUser, async (req, res) => {
    const playlist = await Playlist.find({ user: req.user.id});
    if (playlist.length>0) {
        // if notes found
        // send notes as response
        res.json({ success: true, message: "This route will be used to get all notes.", playlist: playlist });
    } else {

        // if no notes found
        res.json({ success: false, message: "No notes found" });
    }
});
// Route 2: Post a playlist using: POST "/api/playlist/postplaylist". Login required

router.post('/postplaylist', getUser,[
    // validation
    // body('playlistid', 'Enter a valid playlistid').exists()
], async (req, res) => {
     // if there are errors, return Bad request and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
     }
        // if no errors, proceed to save playlist
        // destructuring the content and videoId from the request body
        const { playlistid } = req.body
       
        // check if playlist already exists;
        const playlistExists = await Playlist.findOne({ user: req.user.id, playlistid: playlistid});
        // if playlist already exists, return error
        if (playlistExists) {
            return res.json({ success: false, message: "Playlist already exists" });
        }
        // if playlist does not exist, save the playlist
        const playlist = new Playlist({
            playlistid: playlistid,
            user: req.user.id
        });
        const savedPlaylist = await playlist.save();
        res.json({ success: true, message: "Playlist added successfully", playlist: savedPlaylist });


});
module.exports = router;