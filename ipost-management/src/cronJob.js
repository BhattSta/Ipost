const { Mails } = require("./models");
const moment = require("moment");
const cron = require("node-cron");
const { createResponseData } = require("./utils/response");
const constant = require("./utils/constants");

// For every 24 hours
// 0 */24 * * *

cron.schedule("*/15 * * * * *", async (req, res) => {
  try {
    const mailsToDelete = await Mails.find({
      deleteStatus: { $ne: "DELETED" },
      createdAt: { $lte: moment().subtract(15, "seconds").toDate() },
    });

    for (const mail of mailsToDelete) {
      mail.deleteStatus = "DELETED";
      await mail.save();
    }
    // console.log("Deleted");
  } catch (error) {
    return createResponseData(
      res,
      {},
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      constant.INTERNAL_SERVER_ERROR
    );
  }
});
