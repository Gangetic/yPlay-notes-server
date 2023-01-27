const mongoose =require( 'mongoose');
const { Schema } = mongoose;

// for creating user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

// for creating user model
user=mongoose.model('User', userSchema);
module.exports = user;