const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require("../config/cache")

async function registerController(req, res) {
  const { username, email, password } = req.body;
  let user = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (user) {
    return res.status(400).json({
      message: "User already exist.",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successsfully.",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password");
  if (!user) {
    return res.status(400).json({
      message: "Invalid Credential.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credential.",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User loggedin successsfully.",
    user: {
      username: user.username,
      email: user.email,
    },
    token,
  });
}

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User fetched successfully.",
    user,
  });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  res.clearCookie("token");

  await redis.set(token, Date.now().toString(), "EX",60*60)

  res.status(201).json({
    message:"User logout successfully."
  })
}

module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutUser,
};
