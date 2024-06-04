const Post = require('../models/postModel');
const { notifyUser } = require('./notificationController');
const { getFollowersUser } = require('./userController');

const createPost = async (req, res, next) => {
    try{
        const {content, created_at, isPublic, list_review, tags, title} = req.body;

        const post = new Post({
            content,
            created_at,
            isPublic,
            list_review,
            tags,
            title,
            author: res.locals.idUser.id
        })

        const newPost = await (await post.save()).populate({
            path: 'author',
            select: 'username avatar followers'
        })

        if(isPublic){
            await notifyUser({
                idUser: post.author,
                content: `Đăng Bài Viết ${post._id} Thành Công`,
                created_at: Date.now(),
                link: '',
                img: 'https://cdn-icons-png.flaticon.com/512/1395/1395476.png'
            })
        }else{
            await notifyUser({
                idUser: post.author,
                content: `Lưu Bài Viết ${post._id} Thành Công`,
                created_at: Date.now(),
                link: '',
                img: 'https://cdn-icons-png.flaticon.com/512/1395/1395476.png'
            })
        }

        // const followers = await getFollowersUser(post.author);

        console.log(newPost)

        await Promise.all(newPost.author.followers.map(async (follower)=>{
            await notifyUser({
                idUser: follower,
                content: `${newPost.author.username} đã vừa đăng Bài Viết mới trên Diễn Đàn.`,
                created_at: created_at,
                link: `/post/main/${post._id}`,
                img: newPost.author.avatar
            })
          }))

        return res.status(200).json({
            msg: isPublic ? 'Đăng bài viết thành công' : 'Lưu bài viết thành công',
            id: post._id
        });
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

        // console.log(posts)

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

const getPostAuth = async (req, res, next) => {
    try{
        const post = await Post.findOne({
            _id: req.params.id,
        }).populate({
            path: 'author',
            select: 'username avatar background point _id'
        })
        // console.log(post)
        if(post.author._id.toString()!==res.locals.idUser.id){
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

const getMyPost = async (req, res, next) => {
    try{

        const check = req.params.id === res.locals.idUser.id ? {
            author: req.params.id
        } : {
            author: req.params.id,
            isPublic: true
        }

        const posts = await Post.find(check).populate({
            path: 'author',
            select: 'username avatar'
          }).sort({
            created_at: 'descending'
        })

        return res.status(200).json({
            msg: 'Thành Công',
            data: posts
        })

    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const getClonePost = async (req, res, next) => {
    try{

        const posts = await Post.find({
            author: req.params.id,
            isPublic: true
        }).populate({
            path: 'author',
            select: 'username avatar'
          }).sort({
            created_at: 'descending'
        })

        return res.status(200).json({
            msg: 'Thành Công',
            data: posts
        })

    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const removePost = async (req, res, next) => {
    try{
        
        const post = await Post.findOne({
            _id: req.params.id,
            author: res.locals.idUser.id
        });

        if(!post){
            return res.status(400).json({
                msg: 'Không Thực Hiện Được Yêu Cầu'
            })
        }

        const idP = post._id;

        await Post.deleteOne({
            _id: req.params.id
        })

        await notifyUser({
            idUser: post.author,
            content: `Xoá Bài Đăng ${idP} Thành Công`,
            created_at: Date.now(),
            link: '',
            img: 'https://cdn2.iconfinder.com/data/icons/notes-and-tasks-1/24/Delete-Post_It-512.png'
        })

        return res.status(200).json({
            id: post._id
        });

    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const unupPost = async (req, res, next) => {
    try{
        
        const post = await Post.findOne({
            _id: req.params.id,
            author: res.locals.idUser.id
        });

        if(!post){
            return res.status(400).json({
                msg: 'Không Thực Hiện Được Yêu Cầu'
            })
        }

        const {created_at, tags, title, content, list_review, isPublic} = req.body;

        await Post.findByIdAndUpdate(req.params.id,{
            created_at: created_at,
            tags: tags,
            title: title,
            content: content,
            list_review: list_review,
            isPublic: isPublic
        })

        if(isPublic){
            await notifyUser({
                idUser: post.author,
                content: `Đăng Bài Viết ${post._id} Thành Công`,
                created_at: Date.now(),
                link: '',
                img: 'https://cdn-icons-png.flaticon.com/512/1395/1395476.png'
            })
        }else{
            await notifyUser({
                idUser: post.author,
                content: `Lưu Bài Viết ${post._id} Thành Công`,
                created_at: Date.now(),
                link: '',
                img: 'https://cdn-icons-png.flaticon.com/512/1395/1395476.png'
            })
        }

        return res.status(200).json();

    }catch(e){
        console.log(e)
        return res.status(500).json({
            msg: e
        })
    }
}

const changePost = async (req, res, next) => {
    try{

        const {title, content, tags, list_review, updated_at} = req.body;

        const post = await Post.findById(req.params.id);

        post.title = title;
        post.content = content;
        post.tags = tags;
        post.list_review =list_review;
        post.updated_at.push(updated_at);

        await post.save()

        return res.status(200).json({})

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
    unlikePost,
    getMyPost,
    getClonePost,
    getPostAuth,
    removePost,
    unupPost,
    changePost
}