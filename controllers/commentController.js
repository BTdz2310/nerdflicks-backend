const Comment = require('../models/commentModel');

const createComment = async (req, res, next) => {
    try{
        const {postId, created_at, content, reply} = req.body;
        const comment = await Comment.create({
            postId: postId,
            created_at: created_at,
            content: content,
            reply: reply,
            author: res.locals.idUser.id
        })
        return res.status(200).json({
            msg: 'Tạo thành công',
            data: await Comment.find({
                postId: postId
            }).populate({
                path: 'author',
                select: 'username avatar _id'
              }).sort({
                created_at: 'descending'
            })
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const getAllComment = async (req, res,next) => {
    try{
        const comments = await Comment.find({
            postId: req.params.id
        }).populate({
            path: 'author',
            select: 'username avatar _id'
          }).sort({
            created_at: 'descending'
        })
        
        return res.status(200).json({
            msg: 'Lấy thành công',
            data: comments
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

module.exports = {
    createComment,
    getAllComment
}