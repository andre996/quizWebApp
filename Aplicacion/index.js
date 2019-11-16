const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/monitoringapp");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const usersRouter = require("./routes/userRoute");
const programsRouter = require("./routes/programRouter");
const quizsRouter = require("./routes/quizRouter");

const app = express();

//Midllerware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

//Routers
app.use('/users', usersRouter)
app.use('/programs',programsRouter)
app.use('/quiz',quizsRouter)

//Catch 404 errors and forward then to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const error = app.get("env") === "develoment" ? err : {};
  const status = error.status || 500;

  res.status(status).json({
    error: {
      message: error.message
    }
  });
  

  console.log(err);
});

const port = app.get("port") || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
