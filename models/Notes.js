const mongoose =require( 'mongoose');
const { Schema } = mongoose;


// for creating notes schema
const notesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    ,content: {
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

