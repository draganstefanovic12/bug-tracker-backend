const Project = require("../model/projectModel");
const User = require("../model/userModel");

const createProject = async (req, res) => {
  const { name, assigned, link, description } = req.body;

  userArr = [];
  for (let i = 0; i < assigned.length; i++) {
    userArr.push(JSON.parse(assigned[i]));
  }

  try {
    const project = await Project.create({
      name,
      assigned: userArr,
      link,
      description,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const assignUsers = async (req, res) => {
  const { assign, proj } = req.body;

  userArr = [];
  for (let i = 0; i < assign.length; i++) {
    userArr.push(JSON.parse(assign[i]));
  }

  try {
    const project = await Project.find({ proj });
    const user = await User.findOne({ assign });

    project.assigned.push(user);
    project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addTicket = async (req, res) => {
  const { ticket, proj } = req.body;

  try {
    const project = await Project.findOne({ name: proj });
    project.tickets.push({ ...ticket, created: new Date() });
    project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(err.message);
  }
};

//CHECK IF THIS WORKS WHEN YOU CREATE ASSIGN FUNCTION
const addComment = async (req, res) => {
  const { comment, name, title, usr } = req.body;

  try {
    const project = await Project.findOne({ name: name });
    project.tickets = project.tickets.map((tick) => {
      if (tick.title === title) {
        return {
          ...tick,
          comments: [...tick.comments, { ...comment, created: new Date() }],
        };
      } else {
        return tick;
      }
    });

    //Sending an update to all users assigned to this project that there's a new comment on the ticket
    for (let i = 0; i < project.assigned.length; i++) {
      const user = await User.findOne({
        username: project.assigned[i].username,
      });
      if (user.username !== usr) {
        user.notifications.unshift({
          comment: `${user.username} left a comment.`,
          created: new Date(),
          read: false,
        });
      }
      user.save();
    }

    project.save();
    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
  }
};

const removeProject = async (req, res) => {
  const { _id } = req.body;

  try {
    const project = await Project.findByIdAndDelete({ _id });
    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const closeTicket = async (req, res) => {
  const { ticket, proj } = req.body;

  try {
    const project = await Project.findOne({ name: proj });
    const tick = project.tickets.find((tick) => tick.title === ticket);
    const newTicket = { ...tick, status: "Closed" };
    project.tickets.splice(project.tickets.at(tick), 1, newTicket);
    project.save();
    console.log(tick.status);
    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
  }
};

//--> Find all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json({ projects });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  removeProject,
  assignUsers,
  addTicket,
  addComment,
  closeTicket,
};
