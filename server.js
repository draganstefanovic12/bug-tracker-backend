require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const server = http.createServer(app);
const compression = require("compression");

const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    return false;
  }

  return compression.filter(req, res);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_ID).then((res) => {
  server.listen(process.env.PORT || 3000, () => {
    console.log(
      `connected to the database and listening on port ${process.env.PORT}`
    );
  });
});

app.use("/projects", projectRoutes);

app.use("/users", userRoutes);
