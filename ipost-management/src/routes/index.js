const express = require("express");
const authRoute = require("./auth.route");
const mailRoute = require("./mail.route");
const userRoute = require("./user.route");
const adminRoute = require("./admin.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/mails",
    route: mailRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
