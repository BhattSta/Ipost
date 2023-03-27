const { Users } = require("../models");
const { Mails } = require("../models");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");

const checkToUserEmail = async (req, res) => {
  try {
    // console.log(req.userData);
    // console.log(req.userData.userId);
    const email = req.body.email;
    const validEmail = await Users.findOne({ email: email });
    if (validEmail) {
      return createResponseData(
        res,
        {},
        httpStatus.OK,
        false,
        constant.EMAIL_FOUND
      );
    } else {
      return createResponseData(
        res,
        {},
        httpStatus.UNAUTHORIZED,
        true,
        constant.EMAIL_NOT_REGISTERED
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

const sendMail = async (req, res) => {
  try {
    // console.log(req.body);
    let { from, to, subject, message, attachments } = req.body;
    const validEmail = await Users.findOne({ email: to });
    if (validEmail) {
      from = req.userData.userId;
      to = validEmail._id;
      attachments = [];

      if (req.files && req.files.length > 0) {
        // console.log(req.files);
        req.files.forEach((file) => {
          // console.log(file);
          // attachments.push({
          //     url: file.filename,
          //     type: file.mimetype,
          // });
          attachments.push(file.filename);
        });
      }

      const data = { from, to, subject, message, attachments };
      const mail = new Mails(data);
      const sendMails = await mail.save();
      return createResponseData(
        res,
        {},
        httpStatus.OK,
        false,
        constant.MAIL_SENT
      );
    } else {
      return createResponseData(
        res,
        {},
        httpStatus.NOT_FOUND,
        true,
        constant.RECIPIENT_NOT_REGISTERED
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

const getMail = async (req, res) => {
  try {
    const unreadMailCount = await Mails.find({
      to: req.userData.userId,
      status: "UNREAD",
    }).count();

    const mailData = await Mails.find({
      to: req.userData.userId,
      deleteStatus: "NONE",
    })
      .populate({
        path: "from",
        select: ["firstName", "lastName", "email"],
      })
      .populate({
        path: "to",
        select: ["firstName", "lastName", "email"],
      })
      .sort({ createdAt: -1 });
    return createResponseData(
      res,
      { unreadMailCount, mailData },
      httpStatus.OK,
      false,
      {}
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

const readMail = async (req, res) => {
  try {
    const id = req.params.id;
    const unreadMailCount = await Mails.find({
      to: req.userData.userId,
      status: "UNREAD",
    }).count();

    const readmail = await Mails.findByIdAndUpdate(
      { _id: id },
      { status: "READ", readAt: new Date() },
      {
        new: true,
      }
    )
      .populate({
        path: "from",
        select: ["firstName", "lastName", "email"],
      })
      .populate({
        path: "to",
        select: ["firstName", "lastName", "email"],
      });

    // console.log(readmail);
    return createResponseData(
      res,
      { unreadMailCount, readmail },
      httpStatus.OK,
      false,
      {}
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

const getSentMail = async (req, res) => {
  try {
    const mailData = await Mails.find({ from: req.userData.userId })
      .populate({
        path: "from",
        select: ["firstName", "lastName", "email"],
      })
      .populate({
        path: "to",
        select: ["firstName", "lastName", "email"],
      })
      .sort({ createdAt: -1 });
    return createResponseData(res, mailData, httpStatus.OK, false, {});
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

const deleteMail = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteMail = await Mails.findByIdAndUpdate(
      { _id: id },
      { deleteStatus: "TRASHED", status: "READ", readAt: "" }
    );
    // console.log(deleteMail);
    if (deleteMail) {
      return createResponseData(
        res,
        {},
        httpStatus.OK,
        false,
        constant.MAIL_DELETED
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

const getTrashedMail = async (req, res) => {
  try {
    const toTrashedMails = await Mails.find({
      to: req.userData.userId,
      deleteStatus: "TRASHED",
    })
      .populate({
        path: "from",
        select: ["firstName", "lastName", "email"],
      })
      .populate({
        path: "to",
        select: ["firstName", "lastName", "email"],
      })
      .sort({ createdAt: -1 });
    return createResponseData(res, toTrashedMails, httpStatus.OK, false, {});
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

const counter = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const counter = await Mails.findByIdAndUpdate(
      { _id: id },
      { $inc: { counter: 1 } },
      {
        new: true,
      }
    );

    // console.log(counter);
    return createResponseData(res, counter, httpStatus.OK, false, {});
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
  sendMail,
  getMail,
  getSentMail,
  readMail,
  checkToUserEmail,
  deleteMail,
  getTrashedMail,
  counter,
};
