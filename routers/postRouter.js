const router = require("express").Router();
const {createPost, getAllPosts, getPost, likePost, unlikePost} = require("../controllers/postController");
const auth = require("../middlewares/auth");

router.post("/post", auth, createPost);
router.get('/posts', getAllPosts);
router.get('/post/:id', getPost);
router.get('/likePost/:id', auth, likePost)
router.get('/unlikePost/:id', auth, unlikePost)

module.exports = router;
