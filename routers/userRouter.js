const router = require("express").Router();
const {register, login, getAccessTokenGithub, getUserDataGithub, getUserDataGoogle, checkAuth, test, setFavorite, setList} = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get('/credential', auth, checkAuth);
router.post('/favorite', auth, setFavorite);
router.post('/list', auth, setList);
router.get('/test', test)

router.get('/google/login', (req, res) => {
    const accessToken = req.query.accessToken;
    getUserDataGoogle(accessToken).then((resp) => res.status(resp.status).json(
        {
            msg: resp.msg,
            access_token: resp.access_token,
            user: resp.user,
            isAdmin: resp.user.role==='admin'
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
            user: resp.user,
            isAdmin: resp.user.role==='admin'
        }));
});


module.exports = router;
