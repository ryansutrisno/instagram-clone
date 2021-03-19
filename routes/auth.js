const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const {MAILGUN_API, MAILGUN_DOMAIN, DOMAIN, JWT_SECRET } = require('../config/keys')

const auth = {
    auth: {
        api_key: MAILGUN_API,
        domain: MAILGUN_DOMAIN
    },
    proxy: false
}

const nodemailerMailgun = nodemailer.createTransport(mg(auth))

router.post('/signup', (req, res) => {
    const {name, email, password, picture} = req.body
    if (!name || !email || !password) {
        return res.status(422).json({error: "Please add all the fields"})
    }
    User.findOne({email: email})
        .then((savedUser) => {
            if(savedUser) {
                return res.status(422).json({error: "User already exist with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword,
                        picture
                    })
                    user.save()
                        .then(user => {
                            res.json({message: "Saved succesfully"})
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
        return res.status(422).json({error: "Please add email or password"})
    }
    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch) {
            const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
            const {_id, name, email, followers, following, picture} = savedUser
            res.json({token, user: {_id, name, email, followers, following, picture}})
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

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(422).json({error: "User not exists with that email!"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then((result) => {
                nodemailerMailgun.sendMail({
                    from:'Instaxgram <no-reply@instaxgram.com>',
                    to: user.email,
                    subject: "Reset password",
                    text: "Your requested for reset password",
                    html: `<h3>Your requested for reset password</h3>
                            <h5>Click in this <a href="${DOMAIN}/reset-password/${token}">link</a> to reset password</h5>`
                })
                res.json({message: "Cek your email"})
            })
        })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user => {
        if(!user) {
            return res.status(422).json({error: "Try again session has expired"})
        }
        bcrypt.hash(newPassword, 12).then(hashedPassword => {
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser) => {
                res.json({message: "Password updated successfully"})
            })
        })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router