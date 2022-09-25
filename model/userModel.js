const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// --> For starters im setting this to be schema, will add more if necessary
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
  },
  notifications: {
    type: [],
  },
  projects: {
    //Assigned projects the user has permission to
    type: [],
  },
});

userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fields must be filled out.");
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw Error("Incorrect username.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

userSchema.statics.register = async function (username, password, email, role) {
  //Checking if a user is already signed up
  const existing = await this.findOne({ username });
  if (existing) {
    throw Error("Username already taken");
  }

  //Salting and hashing the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({
    username,
    password: hash,
    email,
    role: role ? role : "user",
  });

  return user;
};

module.exports = mongoose.model("User", userSchema);
