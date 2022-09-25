const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  removeProject,
  assignUsers,
  addTicket,
  addComment,
  closeTicket,
} = require("../controller/projectController");
const requireAuth = require("../middleware/requireAuth");

//--> gets all projects
router.get("/all", getProjects);

router.use(requireAuth);

//--> creates a new project
router.post("/new", createProject);

//--> assigns users to a project
router.post("/assign", assignUsers);

//--> removes the current project
router.post("/remove", removeProject);

//--> creates a new ticket
router.post("/ticket", addTicket);

//--> adds a comment to a ticket
router.post("/comment", addComment);

router.post("/close", closeTicket);

module.exports = router;
