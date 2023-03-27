const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");
const { signToken } = require("../middleware/Tokenauth");

const register = async (req, res) => {
  try {
    let { firstName, lastName, role, email, password } = req.body;
    const existingUser = await Users.findOne({ email: email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      password = hashedPassword;
      const data = { firstName, lastName, role, email, password };
      const user = new Users(data);
      const createUser = await user.save();
      return createResponseData(
        res,
        {},
        httpStatus.CREATED,
        false,
        constant.SUCCESS_REGISTRATION
      );
    } else {
      return createResponseData(
        res,
        {},
        httpStatus.CONFLICT,
        true,
        constant.EXISTING_EMAIL
      );
    }
  } catch (error) {
    return createResponseData(
      res,
      {},
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      constant.INTERNAL_SERVER_ERROR
    );
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await Users.findOne({ email: email });

    if (!user) {
      return createResponseData(
        res,
        {},
        httpStatus.UNAUTHORIZED,
        true,
        constant.EMAIL_NOT_REGISTERED
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return createResponseData(
        res,
        {},
        httpStatus.UNAUTHORIZED,
        true,
        constant.INVALID_PASSWORD
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      process.env.SECRET_KEY
    );

    const data = {
      userId: user._id,
      userName: user.firstName,
      userEmail: user.email,
      token: token,
    };
    return createResponseData(res, data, httpStatus.OK, false, {});
  } catch (error) {
    return createResponseData(
      res,
      {},
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      constant.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  register,
  login,
};
