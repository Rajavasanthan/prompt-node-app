var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var promptRouter = require("./routes/prompts");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cosmic-lokum-28dd15.netlify.app",
    ],
  }),
);

function authorize(req, res, next) {
  if (req.headers.authorization) {
    try {
      const payload = jsonwebtoken.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
      );
      if (payload) {
        req.user = payload;
        next();
      }
    } catch (error) {
      res.status(401).json({
        message: {
          error: "Unauthorized Access",
        },
      });
    }
  } else {
    res.status(401).json({
      message: {
        error: "Unauthorized Access",
      },
    });
  }
}

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/prompt", authorize, promptRouter);

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
  res.render("error");
});

module.exports = app;
