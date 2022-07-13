const express = require("express");
const route = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./services/database/connection");

const app = express();

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// mongoDB connection
connectDB();

// parse request to body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// log request
app.use(morgan("tiny"));

// set view engine
app.set("view engine", "ejs");

// load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// log request
app.use(morgan("tiny"));

// load homepage
route.get("", (req, res) => {
  res.render("index");
});
app.use("/", route);

// load router API v1 ----->BE AWARE CHANGING PATH <-----
app.use("/api/v1", require("./api-v1/routes/router"));

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
