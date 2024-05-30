const Post = require('../models/postModel');

const createPost = async (req, res, next) => {
    try{
        const {content, created_at, isPublic, list_review, tags, title} = req.body;

        const post = await Post.create({
            content,
            created_at,
            isPublic,
            list_review,
            tags,
            title,
            author: res.locals.idUser.id
        })

        return res.status(200).json( isPublic ? 'Đăng bài viết thành công' : 'Lưu bài viết thành công');
    }catch(e){
        console.log(e)
        return res.status(500).json(e)

    }
}

const getAllPosts = async (req, res, next) => {
    try{
        
        const posts = await Post.find({
            isPublic: true
        }).populate({
            path: 'author',
            select: 'username avatar'
          }).sort({
            created_at: 'descending'
        })

        console.log(posts)

        return res.status(200).json({
            msg: 'Lấy thành công',
            data: posts
        });
    }catch(e){
        return res.status(500).json({
            msg: e
        })

    }
}

const getPost = async (req, res, next) => {
    try{
        const post = await Post.findOne({
            _id: req.params.id,
            isPublic: true
        }).populate({
            path: 'author',
            select: 'username avatar background point _id'
        })
        if(!post){
            return res.status(400).json({
                msg: 'Bài Đăng Không Tồn Tại Hoặc Đã Bị Ẩn'
            })
        }
        return res.status(200).json({
            msg: 'Lấy bài đăng thành công',
            post
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const likePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);
        post.unlike.pull(res.locals.idUser.id);
        if(post.like.includes(res.locals.idUser.id)){
            post.like.pull(res.locals.idUser.id);
        }else{
            post.like.push(res.locals.idUser.id);
        }
        await post.save();
        return res.status(200).json({
            msg: 'Like Thành Công',
            liked: post.like,
            unliked: post.unlike
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const unlikePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);
        post.like.pull(res.locals.idUser.id);
        if(post.unlike.includes(res.locals.idUser.id)){
            post.unlike.pull(res.locals.idUser.id);
        }else{
            post.unlike.push(res.locals.idUser.id);
        }
        await post.save();
        return res.status(200).json({
            msg: 'Like Thành Công',
            liked: post.like,
            unliked: post.unlike
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    likePost,
    unlikePost
}