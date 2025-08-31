const express = require("express");
const authMiddleware=require('../middleware/authMiddleware')
const { registerUser, loginUser, searchUser ,addfrnd, getFrnds, sendMsg, getallmsg} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search",searchUser)
router.post("/addfrnd",authMiddleware,addfrnd)
router.get("/getfrnds", authMiddleware,getFrnds)
router.post("/sendmsg",authMiddleware,sendMsg)
router.post("/allmsg",authMiddleware,getallmsg)


module.exports = router;
