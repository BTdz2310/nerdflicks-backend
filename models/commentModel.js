const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'posts'
    },
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
        type: [{
            time: Number,
            content: String
        }],
        default: []
    },
    content: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        default: ''
    },
    like: {
        type: [String],
        default: []
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
},
    {
        collection: 'Comments'
    })

module.exports = mongoose.model('comments', commentSchema)