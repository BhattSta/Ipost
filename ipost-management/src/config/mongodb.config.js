const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.SERVER_DB);

const conn = mongoose.connection;

conn.on("error", (error) => {
  console.error("Database Connection Error:", error.message);
});

conn.on("open", () => {
  console.log("Database Connection Established");
});
