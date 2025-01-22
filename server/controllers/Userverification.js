const express = require('express');
const User = require('../modules/userModel');
const sendVerificationEmail = require('../utils/email');

const verificationCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email and code are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        if (user.codeExpiresAt < new Date()) {
            return res.status(400).json({ message: "Verification code has expired" });
        }

        // Code is valid - proceed with the verification
        user.verificationCode = null; // Clear the code
        user.codeExpiresAt = null; // Clear the expiry time
        user.verifiy = true; //set the verification 
        await user.save();

        res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        console.error("Error verifying code:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const verificationMiddleware = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // Code valid for 10 minutes

        // Store the code and expiry in the database
        user.verificationCode = verificationCode;
        user.codeExpiresAt = codeExpiry;
        await user.save();

        // Send the verification code via email
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
        console.error("Error in verification middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

module.exports = {verificationMiddleware , verificationCode};