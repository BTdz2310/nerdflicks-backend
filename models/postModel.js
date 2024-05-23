const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
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
        type: [{
            media_type: Strin,
            
        }]
    }
},
    {
        collection: 'Posts'
    })

module.exports = mongoose.model('posts', postSchema)