const express = require("express");
const router = express.Router();
const {
  loginUser,
  signUpUser,
  getUser,
  getUsers,
  assignUsers,
  assignProjectsToUsers,
  updateNotifications,
} = require("../controller/userController");

router.post("/login", loginUser);

router.post("/register", signUpUser);

router.get("/user/:username", getUser);

router.get("/all", getUsers);

router.post("/role", assignUsers);

router.post("/assignProject", assignProjectsToUsers);

//sets notifications to read
router.post("/read", updateNotifications);

//Check if anything else is necessary later <--
module.exports = router;
