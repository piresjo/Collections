import { DB_PASSWORD } from "./secrets.js";
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

var app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error.ejs", { error: err });
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "video_game_collection",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
