const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWTSECRET} = require('../keys')
const { json } = require('express')
const requiredLogin = require('../middleware/requireLogin')

router.get('/protected', requiredLogin, (req, res) => {
    res.send('hello user')
})

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    if (!name || !email || !password) {
        return res.status(422).json({error: "please add all the fields"})
    }
    User.findOne({email: email})
        .then((savedUser) => {
            if(savedUser) {
                return res.status(422).json({error: "user already exist with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword
                    })
                    user.save()
                        .then(user => {
                            res.json({message: "saved succesfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(422).json({error: "please add email or password"})
    }
    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch) {
            //   return res.json({message: "Successfully signed in"})
            const token = jwt.sign({_id: savedUser._id}, JWTSECRET)
            res.json({token})
            }
            else {
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

module.exports = router