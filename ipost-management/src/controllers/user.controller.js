const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");

const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName } = req.body;
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
    const { password } = req.body;
    const changePass = await Users.findById({ _id: id });

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      changePass.password = hashedPassword;
    }

    const updatedPassword = await changePass.save();

    return createResponseData(
      res,
      { updatedPassword },
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

module.exports = {
  updateUserProfile,
  changePassword,
};
