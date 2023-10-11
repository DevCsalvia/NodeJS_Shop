const { Router } = require("express");
const authController = require("../controllers/auth");
const router = Router();

router.get("/login", authController.getLogin);
router.get("/reset", authController.getReset);
router.get("/signup", authController.getSignup);
router.get("/reset/:token", authController.getNewPassword);

router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
