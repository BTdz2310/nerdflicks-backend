const Notification = require('../models/notificationModel');

const notifyUser = async (notify) => {
    try{

        const {idUser, content, created_at, link, img} = notify;

        const newNotify = await Notification.create({
            idUser: idUser,
            content: content,
            created_at: created_at,
            link: link,
            img: img
        })

        // return await Notification.find({
        //     idUser: idUser
        // }).sort({
        //     created_at: 'descending'
        // })

    }catch(e){
        throw e;
    }
}

const notifyLike = async (id) => {
    try{

    }catch(e){
        throw e;
    }
}

const getAllNotify = async (req, res, next) => {
    try{
        const notifies = await Notification.find({
            idUser: res.locals.idUser.id
        }).sort({
            created_at: 'descending'
        })
        // console.log(notifies)
        return res.status(200).json({
            data: notifies
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const readNotify = async (req, res, next) => {
    try{
        console.log('kewake')
        const notify = await Notification.findOneAndUpdate({
            _id: req.params.id,
            idUser: res.locals.idUser.id
        },{
            isRead: true
        })  
        return res.status(200).json({
            msg: 'Thành Công'
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const readAllNotify = async (req, res, next) => {
    try{
        const notify = await Notification.updateMany({
            idUser: res.locals.idUser.id
        },{
            isRead: true
        })  
        return res.status(200).json({
            msg: 'Thành Công'
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

module.exports = {
    notifyUser,
    getAllNotify,
    readNotify,
    readAllNotify
}