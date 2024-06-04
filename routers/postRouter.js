const router = require("express").Router();
const {createPost, getAllPosts, getPost, likePost, unlikePost, getMyPost, getClonePost, getPostAuth, removePost, unupPost, changePost} = require("../controllers/postController");
const auth = require("../middlewares/auth");

router.post("/post", auth, createPost);
router.put("/post/:id", auth, unupPost);
router.get('/posts', getAllPosts);
router.get('/post/:id', getPost);
router.get('/postAuth/:id', auth, getPostAuth);
router.get('/likePost/:id', auth, likePost)
router.get('/unlikePost/:id', auth, unlikePost)
router.get('/getPostAuth/:id', auth, getMyPost)
router.get('/getPostNoAuth/:id', getClonePost)
router.delete('/post/:id', auth, removePost);
router.post('/post/:id', auth, changePost)

module.exports = router;
