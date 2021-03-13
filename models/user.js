const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: "https://res.cloudinary.com/rstrz/image/upload/v1615099125/no-profile-picture_ojhxkn.png"
    },
    followers: [{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}]
})

mongoose.model("User", userSchema)