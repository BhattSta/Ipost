const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { checkToken } = require("../middleware/Tokenauth");

router.patch(
  "/updateProfile/:id",
  checkToken,
  userController.updateUserProfile
);

router.patch("/changePassword/:id", checkToken, userController.changePassword);

router.patch("/logout/:id", checkToken, userController.logout);

module.exports = router;
