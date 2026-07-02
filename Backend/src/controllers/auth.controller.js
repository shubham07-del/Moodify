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

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    message: "User registered successsfully.",
    user: {
      username: user.username,
      email: user.email,
    },
    token,
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;
  const searchConditions = [];
  if (email) searchConditions.push({ email });
  if (username) searchConditions.push({ username });

  if (searchConditions.length === 0) {
    return res.status(400).json({ message: "Email or username is required." });
  }

  const user = await userModel
    .findOne({ $or: searchConditions })
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

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.cookie("token", token, cookieOptions);
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
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  if (token) {
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);
  }

  res.status(201).json({
    message: "User logout successfully."
  });
}

module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutUser,
};
