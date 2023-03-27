const app = require("./app");
require("./config/mongodb.config");
require("./routes/index");
// require("./cronJob");

const port = process.env.PORT || 4002;

app.get("/", (req, res) => {
  res.send("Welcome To Home Page");
});

app.get("*", (req, res) => {
  res.send("Page Not Found");
});

app.listen(port, () => {
  console.log(`Running On Port ${port}`);
});
