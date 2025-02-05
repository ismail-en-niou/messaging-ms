const userModel = require('../modules/userModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ msg: 'Please enter all fields' });
        if (!validator.isEmail(email))
            return res.status(400).json({ msg: 'Please enter a valid email' });
        const existingUser = await userModel.findOne({ email });
        if (existingUser)
            return res.status(400).json({ msg: 'User already exists' });
        const salt = await bcrypt.genSalt(2);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.json({
            token,
            user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};


const userLogin = async (req , res) =>
{
    const {email , pass } = req.body;
    try {
        // check if user is in data base or no 
        const user = await userModel.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: 'invalid email or password' });
        if (!user.password) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        const isValidpass = await bcrypt.compare(pass , user.password);
        if (!isValidpass)
            return res.status(400).json({ msg: 'invalid email or password' });
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(200).json({ token : token  , _id : user._id , username : user.username});

    }catch(error){
        console.log(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

const findUser = async (req , res) =>{
    const userid = req.params.userId ;
    try {
        const user = await userModel.findById(userid);
        // console.log(user);
        res.status(200).json({
            email: user.email,
            username: user.username,
            verify: user.verifiy,
            _id: user._id
          });
    }catch(error){
        console.log(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

const getUsers = async (req , res)=>
{
    try {
        const user = await userModel.find();
        res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(500).json({ msg: 'Server error' });
    }
}
module.exports = { registerUser , userLogin , findUser , getUsers};