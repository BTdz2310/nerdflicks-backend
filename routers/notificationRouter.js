const router = require("express").Router();
const {getAllNotify, readNotify, readAllNotify} = require("../controllers/notificationController");
const auth = require("../middlewares/auth");

router.get('/notifications', auth, getAllNotify)
router.get('/readNotify/:id', auth, readNotify)
router.get('/readAllNotify', auth, readAllNotify)


module.exports = router;
