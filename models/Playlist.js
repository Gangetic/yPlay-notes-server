const mongoose =require( 'mongoose');
const { Schema } = mongoose;


// for creating notes schema
const playlistSchema = new Schema({
    playlistid:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

// for creating notes model
module.exports = mongoose.model('playlists', playlistSchema);

