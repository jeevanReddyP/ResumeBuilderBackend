const User = require("../models/User")
const bcrypt = require("bcrypt")
const express = require("express")
const jwt = require("jsonwebtoken")


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

exports.RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name,email,password)        
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ Msg: "User already exists" })
        }
        if (password.length < 6) {
           return  res.status(400).json({ Msg: "Password Must Be 6 Charecters" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)
        const user = new User({
            name,
            email,
            password: hashedpassword
        })
        await user.save()
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({
            Msg: "Server Error",
            error: error.message
        })
    }
},

    exports.loginUser = async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ Msg: "Invalid User Or Password" })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ Msg: "Invalid User Or Password" })
            }
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } catch (error) {
            res.status(500).json({
                Msg: "Server Error",
                error: error.message
            })
        }
    },

    exports.getUser = async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password")
            if (!user) {
                return res.status(404).json({ Msg: "User Not Found!" })
            }
            res.json(user)
        } catch (error) {
            res.status(500).json({
                Msg: "Server Error",
                error: error.message
            })
        }
    }