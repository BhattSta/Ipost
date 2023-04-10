const express = require("express");
const router = express.Router();
const { adminController } = require("../controllers");
const { adminValidation } = require("../validations");
const { checkToken } = require("../middleware/Tokenauth");

router.post(
  "/adminRegistration",
  adminValidation.adminRegistrationValidation,
  adminController.createAdmin
);

router.post(
  "/adminLogin",
  adminValidation.adminLoginValidation,
  adminController.adminLogin
);

router.get("/getUserCount", checkToken, adminController.getTotalUsers);
router.get("/getTotalMails", checkToken, adminController.getTotalMails);
router.get("/getUsersList", checkToken, adminController.getUsersList);
router.get("/getMailsList/:id", checkToken, adminController.getMailsList);
router.patch("/logout/:id", checkToken, adminController.adminLogout);

module.exports = router;
