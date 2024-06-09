const authController = require("../controller/authController");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login",authController.loginUser);
router.post("/login/touchid",authController.loginTouch)
router.post("/logout",authController.logOut);
module.exports = router;