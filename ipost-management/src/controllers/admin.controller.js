const { Users } = require("../models");
const { Mails } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");
const mongoose = require("mongoose");

const createAdmin = async (req, res) => {
  try {
    let { firstName, lastName, role, email, password } = req.body;
    const existingAdmin = await Users.findOne({ email: email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      password = hashedPassword;
      const data = { firstName, lastName, role: "admin", email, password };
      const admin = new Users(data);
      const createAdmin = await admin.save();
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

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    const admin = await Users.findOne({
      email: email,
      role: ["superAdmin", "admin"],
    });
    if (!admin) {
      return createResponseData(
        res,
        {},
        httpStatus.UNAUTHORIZED,
        true,
        constant.INVALID_ADMIN
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

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
        userId: admin._id,
        userEmail: admin.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5h" }
    );

    // const date = Date.now()
    // console.log(new Date(date).toString())
    // const newdate = date + 5 * (60 * 60 * 1000)
    // console.log(new Date(newdate).toString())
    const tokenExpiryTime = Date.now() + 5 * (60 * 60 * 1000);
    const Token = { token: token, tokenExpiry: tokenExpiryTime };
    admin.authToken = Token;
    await admin.save();

    const data = {
      adminId: admin._id,
      adminFirstName: admin.firstName,
      adminLastName: admin.lastName,
      adminEmail: admin.email,
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

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await Users.find({ role: "user" }).count();
    return createResponseData(res, { totalUsers }, httpStatus.OK, false, {});
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

const getTotalMails = async (req, res) => {
  try {
    const totalMails = await Mails.find().count();
    return createResponseData(res, { totalMails }, httpStatus.OK, false, {});
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

const getUsersList = async (req, res) => {
  try {
    const userQuery = [
      {
        $match: {
          role: "user",
        },
      },
      {
        $lookup: {
          from: "mails",
          localField: "_id",
          foreignField: "from",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "mails",
          localField: "_id",
          foreignField: "to",
          as: "receiver",
        },
      },
      {
        $addFields: {
          totalSent: {
            $size: "$sender",
          },
          totalReceived: {
            $size: "$receiver",
          },
        },
      },
      {
        $project: {
          totalReceived: 1,
          totalSent: 1,
          // firstName: 1,
          // lastName: 1,
          fullName: { $concat: ["$firstName", " ", "$lastName"] },
          email: 1,
        },
      },
    ];
    const usersList = await Users.aggregate(userQuery);
    // console.log(usersList);
    return createResponseData(res, usersList, httpStatus.OK, false, {});
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

const getMailsList = async (req, res) => {
  try {
    const userId = req.params.id;
    const mailQuery = [
      {
        $match: {
          $or: [
            { from: mongoose.Types.ObjectId(userId) },
            { to: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "Sent",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          as: "received",
        },
      },
      {
        $project: {
          from: {
            $arrayElemAt: ["$Sent.email", 0],
          },
          to: {
            $arrayElemAt: ["$received.email", 0],
          },
          subject: 1,
          counter: 1,
        },
      },
    ];

    const mailsList = await Mails.aggregate(mailQuery);
    // console.log(mailsList);
    return createResponseData(res, mailsList, httpStatus.OK, false, {});
  } catch (error) {
    console.log(error);
    return createResponseData(
      res,
      {},
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      constant.INTERNAL_SERVER_ERROR
    );
  }
};

const adminLogout = async (req, res) => {
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
  createAdmin,
  adminLogin,
  getTotalUsers,
  getTotalMails,
  getUsersList,
  getMailsList,
  adminLogout,
};
