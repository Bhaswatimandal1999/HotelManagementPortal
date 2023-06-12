const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    owner_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}

