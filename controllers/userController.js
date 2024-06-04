const User = require('../models/userModel');
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const { notifyUser } = require('./notificationController');

async function hash(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

async function verify(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
};

const register = async (req, res, next) => {

    const {username, password} = req.body;

    const passwordHash = await hash(password);

    try{
        let userNew;
        const user = await User.findOne({
            username
        })
        if(user){

            return res.status(400).json('Tài Khoản Đã Tồn Tại')

        }else{
            userNew = await User.create(
                {
                    username: username,
                    password: passwordHash,
                }
            );

            await adminAdd(userNew._id)

        }

        return res.status(200).json('Tạo Mới Tài Khoản Thành Công')

    }catch(err){

        return res.status(500).json(err)

    }

}

const login = async (req, res, next) => {

    const {username, password} = req.body;

    try{
        const user = await User.findOne({
            username
        })

        if(!user) return res.status(400).json("Tên Tài Khoản Không Tồn Tại!")
        const match = await verify(password, user.password);
        if(!match) return res.status(400).json("Sai Mật Khẩu!");
        
        const access_token = createAccessToken({ id: user._id });

        return res.status(200).json({
            access_token,
            user:{
                favorite: user.favorite,
                list: user.list,
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
                followers: user.followers,
                followings: user.followings
            },
            isAdmin: user.role==='admin',
            id: user._id
        });

    }catch(err){
        // console.log(err)
        return res.status(500).json(err)
    }
}

const getAccessTokenGithub = async (code) => {
    try {
      const params = `?client_id=Ov23liFyaFHHCEnUXAUo&client_secret=5909eca69393e5b5f1fc2b9302ae77c9dbfb0398&code=${code}`;
  
      const response = await fetch(
        `https://github.com/login/oauth/access_token${params}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        },
      );
        const json = await response.json();

        return json;
    } catch (error) {
        return null;
    }
  };

  const getUserDataGithub = async (accessToken) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const user = await loginUserGithub(data);
        const access_token = createAccessToken({ id: user._id });
        return{
            status: 200,
            msg: "Đăng nhập thành công!",
            access_token,
            user
        }
    } catch (error) {
      return {
        status: 400,
        msg: error
      }
    }
  };


  const getUserDataGoogle = async (accessToken) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
      );
    const data = await response.json();
    // console.log(data);
    const user = await loginUserGoogle(data);
    const access_token = createAccessToken({ id: user._id });
    return{
        status: 200,
        msg: "Đăng nhập thành công!",
        access_token,
        user
    }
    } catch (error) {
      return {
        status: 400,
        msg: error
      }
    }
  };

  const loginUserGoogle = async (data) => {
    try{
        let user = await User.findOne({
            social: 'google',
            socialId: data.sub
        });
        if(!user){
            await User.create({
                username: data.email,
                email: data.email,
                fullname: data.name,
                avatar: data.picture,
                social: 'google',
                socialId: data.sub,
                role: 'user'
            })
            user = await User.findOne({
                social: 'google',
                socialId: data.sub
            })

            await adminAdd(user._id)

        }
        return user;
    }catch(e){
        throw new Error(e.message);
    }
  }

  const loginUserGithub = async (data) => {
    try{
        let user = await User.findOne({
            social: 'github',
            socialId: data.id
        });
        if(!user){
            await User.create({
                username: data.login,
                fullname: data.name,
                avatar: data.avatar_url,
                social: 'github',
                socialId: data.id,
                role: 'user'
            })
            user = await User.findOne({
                social: 'github',
                socialId: data.id
            })

            await adminAdd(user._id)

        }
        return user;
    }catch(e){
        throw new Error(e.message);
    }
  }

  const checkAuth = async (req, res, next) => {
    const user = await User.findOne({
        _id: res.locals.idUser.id
    }, '_id list favorite username avatar followers followings')
    return res.status(200).json({
        user,
        isAdmin: user.role==='admin'
    })
}

const setFavorite = async (req, res, next) => {
    try{
        const user = await User.findById(res.locals.idUser.id);
        user.favorite = req.body;
        await user.save();

        await notifyUser({
            idUser: res.locals.idUser.id,
            content: `Bạn Đã Cập Nhật Danh Sách Yêu Thích Thành Công`,
            created_at: Date.now(),
            link: `/user/favorite/${res.locals.idUser.id}`,
            img: 'https://static.vecteezy.com/system/resources/thumbnails/028/146/432/small/favorite-line-icon-vector.jpg'
        })

        return res.status(200).json({
            data: user.favorite,
            msg: 'Cập Nhật Thành Công'
        })
    }catch(e){
        return res.status(500).json({
            msg: `Lỗi: ${e}`
        })
    }
}

// const setFavorite2 = async (req, res, next) => {
//     try{
//         const user = await User.findById(res.locals.idUser.id);
//         user.favorite = req.body;
//         await user.save();

//         return res.status(200).json({
//             data: user.favorite,
//             msg: 'Cập Nhật Thành Công'
//         })
//     }catch(e){
//         return res.status(500).json({
//             msg: `Lỗi: ${e}`
//         })
//     }
// }

const setList = async (req, res, next) => {
    try{
        const user = await User.findById(res.locals.idUser.id);
        user.list = req.body;
        await user.save();

        await notifyUser({
            idUser: res.locals.idUser.id,
            content: `Bạn Đã Cập Nhật Danh Sách Lưu Thành Công`,
            created_at: Date.now(),
            link: `/user/list/${res.locals.idUser.id}`,
            img: 'https://static.thenounproject.com/png/3884719-200.png'
        })

        return res.status(200).json({
            data: user.list,
            msg: 'Cập Nhật Thành Công'
        })
    }catch(e){
        return res.status(500).json({
            msg: `Lỗi: ${e}`
        })
    }
}

const getUser = async (req, res, next) => {
    try{
        const user = await User.findOne({
            _id: req.params.id
        }, 'username email avatar background followers followings').populate({
            path: 'followers followings',
            select: 'username avatar _id'
          })

        return res.status(200).json({
            user
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const checkUsername = async (req, res, next) => {
    try{
        const user = await User.findOne({
            username: req.params.username
        })
        // console.log(user)
        if(!user){
            return res.status(200).json({
                msg: 'Tên username đủ điều kiện để đặt'
            })
        }
        return res.status(400).json({
            msg: 'Tên username đã tồn tại. Vui lòng tìm tên khác'
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const checkEmail = async (req, res, next) => {
    try{
        const user = await User.findOne({
            email: req.params.email
        })
        if(!user){
            return res.status(200).json({
                msg: 'Email đủ điều kiện'
            })
        }
        return res.status(400).json({
            msg: 'Email đã được sử dụng'
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const test = async (req, res) => {
    const users = await User.find({});
    return res.json({
        data: users.map(user=>user.username)
    })
}

const updateUser = async (req, res, next) => {
    try{
        const {avatar, background, username, email} = req.body;
        if(req.params.id!==res.locals.idUser.id) return res.status(400).json({
            msg: 'Không Thể Cập Nhật Tài Khoản Này'
        })
        const user = await User.findByIdAndUpdate(res.locals.idUser.id,{
            avatar: avatar,
            background: background,
            username: username,
            email: email
        })
        return res.status(200).json({
            msg: 'Cập Nhật Thành Công'
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const allUser = async (req, res, next) => {
    try{
        const users = await User.find({

        }, '_id username');
        return res.status(200).json({
            data: users
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const setFollow = async (req, res, next) => {
    try{

        const {idUser} = req.body;

        const me1 = await User.findById(res.locals.idUser.id);

        const you1 = await User.findById(idUser);

        me1.followings.push(idUser);
        you1.followers.push(res.locals.idUser.id);

        const me = await User.validate(me1);
        const you = await User.validate(you1);

        await User.findByIdAndUpdate(res.locals.idUser.id, me);
        await User.findByIdAndUpdate(idUser, you);

        await notifyUser({
            idUser: me1._id,
            content: `Bạn Đã Theo Dõi ${you1.username} Thành Công`,
            created_at: Date.now(),
            link: `/user/profile/${you1._id}`,
            img: you1.avatar
        })

        await notifyUser({
            idUser: you1._id,
            content: `${me1.username} Đã Theo Dõi Bạn`,
            created_at: Date.now(),
            link: `/user/profile/${me1._id}`,
            img: me1.avatar
        })

        return res.status(200).json({
            msg: 'Thành Công',
            user: await User.findById(res.locals.idUser.id, 'username email avatar background followers followings'),
            isAdmin: me.role==='admin',
            id: me._id
        })

    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const setUnFollow = async (req, res, next) => {
    try{

        const {idUser} = req.body;

        const me1 = await User.findById(res.locals.idUser.id);
        // console.log(idUser)

        const you1 = await User.findById(idUser);
        // console.log('trc',me)
        me1.followings.pull(idUser);
        you1.followers.pull(res.locals.idUser.id);
        // console.log('sau',me)
        // await you.save();

        const me = await User.validate(me1);
        const you = await User.validate(you1);

        await User.findByIdAndUpdate(res.locals.idUser.id, me);
        await User.findByIdAndUpdate(idUser, you);

        await notifyUser({
            idUser: me1._id,
            content: `Bạn Đã Huỷ Theo Dõi ${you1.username} Thành Công`,
            created_at: Date.now(),
            link: `/user/profile/${you1._id}`,
            img: you1.avatar
        })

        // console.log(await User.validate(me1))

        // console.log('end', me)

        return res.status(200).json({
            msg: 'Thành Công',
            // user: await User.findById(res.locals.idUser.id, 'username email avatar background followers followings'),
            user: me1,
            isAdmin: me1.role==='admin',
            id: me1._id
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            msg: e
        })
    }
}

const getFavorite = async (req, res, next) => {
    try{
        const favorite = await User.findById(res.locals.idUser.id, 'favorite');

        return res.status(200).json({
            data: favorite
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const getList = async (req, res, next) => {
    try{
        const list = await User.findById(res.locals.idUser.id, 'list');

        return res.status(200).json({
            data: list
        })
    }catch(e){
        return res.status(500).json({
            msg: e
        })
    }
}

const adminAdd = async (id) => {
    try{
        const admin = await User.findOne({
            role: 'admin'
        })

        admin.followers.push(id);
        admin.followings.push(id);

        await admin.save();

    }catch(e){
        throw e;
    }
}

module.exports = {
    register,
    login,
    getAccessTokenGithub,
    getUserDataGithub,
    getUserDataGoogle,
    checkAuth,
    setFavorite,
    setList,
    getUser,
    test,
    checkUsername,
    checkEmail,
    updateUser,
    allUser,
    setFollow,
    setUnFollow,
    getFavorite,
    getList
}