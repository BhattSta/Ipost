const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");
const { Users } = require("../models");

const checkToken = async (req, res, next) => {
  try {
    // console.log(req.headers);
    let token = req.headers["authorization"];
    if (token) {
      token = token.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      const user = await Users.findOne({
        "authToken.token": token,
        "authToken.tokenExpiry": { $gt: Date.now() },
      });

      if (user) {
        req.userData = decodedToken;
        next();
      }
    }
  } catch (error) {
    return createResponseData(
      res,
      {},
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      constant.TOKEN_EXPIRED
    );
  }
};

module.exports = {
  checkToken,
};
