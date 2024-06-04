const mongoose = require('mongoose');

const backgroundRandom = ['https://4kwallpapers.com/images/walls/thumbs_3t/8621.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8616.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8626.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8574.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8538.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8633.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8618.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8623.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8582.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8568.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8608.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8610.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8604.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8404.png'];

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
    background: {
        type: String,
        default: backgroundRandom[Math.floor(Math.random() * backgroundRandom.length)]
    },
    social: {
        type: String
    },
    socialId: {
        type: String
    },
    followings: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        default: ['665af25313e85e8a47ea8b7f']
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        default: ['665af25313e85e8a47ea8b7f']
    },
    favorite: {
        type: Array,
        default: []
    },
    list: {
        type: Map,
        default: {
            'Xem Sau': []
        }
    }
},
    {
        collection: 'Users'
    })

module.exports = mongoose.model('users', userSchema)