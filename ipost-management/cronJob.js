require("dotenv").config();
const { Mails } = require("./src/models");
const moment = require("moment");

// For every 24 hours
// 0 */24 * * *

// cron.schedule("*/15 * * * * *", async (req, res) => {
//   try {
//     const mailsToDelete = await Mails.find({
//       deleteStatus: { $ne: "DELETED" },
//       createdAt: { $lte: moment().subtract(15, "seconds").toDate() },
//     });

//     for (const mail of mailsToDelete) {
//       mail.deleteStatus = "DELETED";
//       await mail.save();
//     }
//     // console.log("Deleted");
//   } catch (error) {
//     return createResponseData(
//       res,
//       {},
//       httpStatus.INTERNAL_SERVER_ERROR,
//       true,
//       constant.INTERNAL_SERVER_ERROR
//     );
//   }
// });

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE);

const conn = mongoose.connection;

conn.on("error", (error) => {
  console.error("Database Connection Error:", error.message);
});

conn.on("open", async (req, res) => {
  console.log("Database Connection Established");

  try {
    console.log("Cron Is Running");
    const mailsToDelete = await Mails.find({
      deleteStatus: { $ne: "DELETED" },
      createdAt: { $lte: moment().subtract(15, "seconds").toDate() },
    });

    for (const mail of mailsToDelete) {
      mail.deleteStatus = "DELETED";
      await mail.save();
    }
    console.log("Mails Deleted");
  } catch (error) {
    console.error("MongoDB Query Error:", error.message);
  }
  conn.close(function () {
    console.log("Database Connection Closed");
  });
});
