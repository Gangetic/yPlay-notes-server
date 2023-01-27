const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const getuser = require('../middleware/getUser');

// for using environment variables
dotenv.config();


// for validating user input
const { body, validationResult } = require('express-validator');

// for parsing json data
router.use(express.json());


// Route 1: Create a user using: POST "/api/auth/createuser". No login required

// create User using: POST /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
   
    // if there are errors, return Bad request and the errors    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        // check if email already exists in the collection
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            name: req.body.name,
            password: securePassword,
            email: req.body.email
        });

        // save the user to the database
        await newUser.save();

        // create a json web token
        const data = {
            user: {
                id: newUser.id
            }
        }
        // sign the token
        const authToken = jwt.sign(data, process.env.SECRET_KEY);
        
        // send the token to the client
        res.json({ authToken });

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Some error occured");

    }


});



// Route 2: Authenticate a user using: POST "/api/auth/login". 

// authenticate a user using: POST /api/auth/login
router.post('/signin', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cant be blank').exists()
], async (req, res) => {

    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // destructure the request body
    const { email, password } = req.body;
    try {
        
        let user = await User.findOne({email:email});
        console.log(user.email);
        console.log(user.password);

        // if user does not exist
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        
        // if password does not match
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
        console.log("User authenticated");

        // if user is authenticated
        // create a json web token
        const data = {
            user:{
                id:user.id
            }
        }
        // sign the token
        const authToken = jwt.sign(data, process.env.SECRET_KEY);
        // send the token to the client
        res.json({authToken});

    } catch (error) {
        // if any error occurs
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
});

// export router
module.exports = router;


// Route 3: Get logged in user details using: POST "/api/auth/getuser". Login required
router.post('/getuser', getuser, async (req, res) => {
    try {
        // get the user id from the request
        const userId = req.user.id;
        // find the user in the database
        user=await User.findOne({_id:userId}).select("-password");
        // send the user details to the client
        res.send(user);
    } catch (error) {
        // if any error occurs
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});





// logger and sqs are two different modules
