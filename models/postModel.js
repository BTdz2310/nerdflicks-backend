const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    created_at: {
        type: Number,
        required: true
    },
    updated_at: {
        type: [Number],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    list_review: {
        type: [Object]
    },
    isPublic: {
        type: Boolean
    },
    like: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },
    unlike: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    }
},
    {
        collection: 'Posts'
    })

module.exports = mongoose.model('posts', postSchema)