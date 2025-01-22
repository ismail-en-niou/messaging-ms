const userModel = require('../modules/userModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Please enter a valid email' });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(2);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Generate JWT
        const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET, { expiresIn: 3600 });

        // Respond with token and user details
        res.json({
            token,
            user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


module.exports = { registerUser };