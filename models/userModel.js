const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
    },
    point: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1715904000&semt=ais_user'
    },
    social: {
        type: String
    },
    socialId: {
        type: String
    },
    followings: {
        type: [String],
        default: []
    },
    followers: {
        type: [String],
        default: []
    },
    favorite: {
        type: Array,
        default: []
    },
    list: {
        type: Map,
        default: new Map()
    }
},
    {
        collection: 'Users'
    })

module.exports = mongoose.model('users', userSchema)