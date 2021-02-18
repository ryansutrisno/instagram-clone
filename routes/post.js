const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requiredLogin = require('../middleware/requireLogin')

router.get('/allpost', (req, res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/createpost', requiredLogin, (req, res) => {
    const { title, caption } = req.body
    if(!title || !caption) {
        return res.status(422).json({error: "Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post ({
        title,
        caption,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/mypost', requiredLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router