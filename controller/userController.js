const User = require("../model/userModel");
const Project = require("../model/projectModel");
const jwt = require("jsonwebtoken");

//--> sending back a token that lasts 7 days for auth
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);

    res.status(200).json({
      username,
      token,
      role: user.role,
      notifications: user.notifications,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const signUpUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const user = await User.register(username, password, email, role);
    const token = createToken(user._id);
    res.status(200).json({ username, token, role: user.role });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const assignProjectsToUsers = async (req, res) => {
  const { user, proj } = req.body;

  try {
    const project = await Project.findOne({ name: proj });
    const usr = await User.findOne({ username: user });
    usr.notifications.push({
      comment: `You have been assigned to project ${project}`,
      created: new Date(),
      read: false,
    });
    project.assigned.push(usr);
    project.save();
    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
  }
};

const assignUsers = async (req, res) => {
  const { name, role } = req.body;
  try {
    const user = await User.findOne({ username: name });
    user.role = role;
    user.notifications.push({
      comment: `You have been assigned ${role} role.`,
      created: new Date(),
      read: false,
    });
    user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
  }
};

const updateNotifications = async (req, res) => {
  const { user } = req.body;

  try {
    const usr = await User.findOne({ username: user });
    usr.notifications = usr.notifications.map((notif) => {
      return { ...notif, read: true };
    });
    usr.save();
    res.status(200).json(usr);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  getUser,
  loginUser,
  signUpUser,
  getUsers,
  assignUsers,
  assignProjectsToUsers,
  updateNotifications,
};
