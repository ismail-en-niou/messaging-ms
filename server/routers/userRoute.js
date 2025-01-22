const express = require('express');
const router = express.Router();
const User = require('../modules/userModel');
const {registerUser} = require('../controllers/userController');
const {verificationMiddleware , verificationCode} = require('../controllers/Userverification');



router.get('/', (req, res) => {
    res.send('welcom our chat app');
});


router.post("/register", registerUser);
router.post("/login", registerUser);
router.post('/verification', verificationMiddleware, (req, res) => {
    const { verificationCode } = req;
    res.status(200).json({ message: "Verification code generated", code: verificationCode });
});
router.post('/verification-code', verificationCode);


module.exports = router;