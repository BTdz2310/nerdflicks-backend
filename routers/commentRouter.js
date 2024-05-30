const router = require("express").Router();
const {createComment, getAllComment} = require("../controllers/commentController");
const auth = require("../middlewares/auth");

router.post("/comment", auth, createComment);
router.get('/comments/:id', getAllComment)

module.exports = router;
