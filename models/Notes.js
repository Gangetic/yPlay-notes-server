const mongoose =require( 'mongoose');
const { Schema } = mongoose;


// for creating notes schema
const notesSchema = new Schema({
    playlistid:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// for creating notes model
module.exports = mongoose.model('Notes', notesSchema);

