import express from "express";
import bodyParser from "body-parser";
import { methodOverride } from "method-override";


import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import fileUpload from "express-fileupload";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

export default function makeApp(database) {
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
  app.use(fileUpload());

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

  database.connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL: " + err.stack);
      return;
    }
    console.log("Connected to MySQL as ID " + database.connection.threadId);
  });

  return app;
}
