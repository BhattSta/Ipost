const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");

const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(req.body);
    const { firstName, lastName } = req.body;
    const user = await Users.findById({ _id: id });
    // const user = await Users.findByIdAndUpdate(
    //   { _id: id },
    //   { firstName: firstName, lastName: lastName }
    // );

    if (!user) {
      return createResponseData(
        res,
        {},
        httpStatus.NOT_FOUND,
        true,
        constant.USER_NOT_FOUND
      );
    }

    // user.firstName = firstName;
    // user.lastName = lastName;
    user.firstName =
      firstName.charAt(0).toUpperCase() + "" + firstName.slice(1);
    user.lastName = lastName.charAt(0).toUpperCase() + "" + lastName.slice(1);

    const updatedUser = await user.save();

    return createResponseData(
      res,
      { user: updatedUser },
      httpStatus.OK,
      false,
      constant.SUCCESS_UPDATE_USER_PROFILE
    );
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

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, password } = req.body;
    const user = await Users.findById({ _id: id });

    if (!user) {
      return createResponseData(
        res,
        {},
        httpStatus.NOT_FOUND,
        true,
        constant.USER_NOT_FOUND
      );
    }

    const passwordMatches = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatches) {
      return createResponseData(
        res,
        {},
        httpStatus.BAD_REQUEST,
        true,
        constant.INVALID_OLD_PASSWORD
      );
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    return createResponseData(
      res,
      {},
      // { user: updatedUser },
      httpStatus.OK,
      false,
      constant.SUCCESS_UPDATE_USER_PASSWORD
    );
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

const logout = async (req, res) => {
  try {
    const id = req.params.id;
    const logout = await Users.findByIdAndUpdate(
      { _id: id },
      { "authToken.tokenExpiry": Date.now() },
      {
        new: true,
      }
    );
    // { $unset: { authToken: 1 } }
    return createResponseData(
      res,
      {},
      httpStatus.OK,
      false,
      constant.LOG_OUT_SUCCESS
    );
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
  updateUserProfile,
  changePassword,
  logout,
};
