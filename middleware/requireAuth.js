const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const usr = authorization.split(" ")[0];
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;

//--> im checking if the user who sent the request
// req.user = await User.findOne({ _id }).select("username");
// if (usr !== req.user.username) {
//   res.status(401).json("Request is not authorized.");
//   return;
// }
