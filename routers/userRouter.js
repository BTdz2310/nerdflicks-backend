const router = require("express").Router();
const {register, login, getAccessTokenGithub, getUserDataGithub, getUserDataGoogle, checkAuth, test, setFavorite, setList, getUser, checkUsername, checkEmail, updateUser, allUser} = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get('/credential', auth, checkAuth);
router.post('/favorite', auth, setFavorite);
router.post('/list', auth, setList);
router.get('/user/:id', getUser);
router.post('/user/:id', auth, updateUser);
router.get('/checkUsername/:username', checkUsername);
router.get('/checkEmail/:email', checkEmail);
router.get('/allUser', allUser);
router.get('/test', test)

router.get('/google/login', (req, res) => {
    const accessToken = req.query.accessToken;
    getUserDataGoogle(accessToken).then((resp) => res.status(resp.status).json(
        {
            msg: resp.msg,
            access_token: resp.access_token,
            user: {
                favorite: resp.user.favorite,
                list: resp.user.list,
                _id: resp.user._id,
                username: resp.user.username,
                avatar: resp.user.avatar
            },
            isAdmin: resp.user.role==='admin',
            id: resp.user._id
        }
    ));
});

router.get('/github/accessToken', (req, res) => {
    const code = req.query.code;
    getAccessTokenGithub(code).then((resp) => res.json(resp));
});
  
router.get('/github/login', (req, res) => {
    const accessToken = req.query.accessToken;
    getUserDataGithub(accessToken).then((resp) => res.status(resp.status).json(
        {
            msg: resp.msg,
            access_token: resp.access_token,
            user: {
                favorite: resp.user.favorite,
                list: resp.user.list,
                _id: resp.user._id,
                username: resp.user.username,
                avatar: resp.user.avatar
            },
            isAdmin: resp.user.role==='admin',
            id: resp.user._id
        }));
});


module.exports = router;
