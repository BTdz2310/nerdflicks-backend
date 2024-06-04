const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Number,
        required: true
    },
    link: {
        type: String
    },
    img: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
    {
        collection: 'Notifications'
    })

module.exports = mongoose.model('notifications', notificationSchema)