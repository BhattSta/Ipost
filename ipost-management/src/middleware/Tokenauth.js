const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");

const checkToken = async (req, res, next) => {
  try {
    // console.log(req.headers);
    let token = req.headers["authorization"];
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, (error, valid) => {
        if (!error) {
          req.userData = valid;
          next();
        } else {
          return createResponseData(
            res,
            {},
            httpStatus.UNAUTHORIZED,
            true,
            constant.TOKEN_NOT_VALID
          );
        }
      });
    } else {
      return createResponseData(
        res,
        {},
        httpStatus.UNAUTHORIZED,
        true,
        constant.TOKEN_NOT_VALID
      );
    }
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({ Error: error });
  }
};

module.exports = {
  checkToken,
};
