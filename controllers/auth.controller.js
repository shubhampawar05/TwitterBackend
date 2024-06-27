import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/utils.js";
import { catchAsync } from "../middlewares/errorHandler.js";

const signup = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const userNameExist = await userModel.findOne({ username });
  //   console.log(userNameExist);
  if (userNameExist) {
    return res.status(400).json({ error: "username is  aready taken" });
  }

  const emailNameExist = await userModel.findOne({ email });
  //   console.log(emailNameExist);
  if (emailNameExist) {
    return res.status(400).json({ error: "email is  aready taken" });
  }
  if (!fullname) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  //   pasword hassing here
  const hassPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    fullname,
    username,
    email,
    password: hassPassword,
  });
  if (newUser) {
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
      bio: newUser.bio,
    });
  } else {
    res.status(400).json({
      error: "invalid user Data ",
    });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!password && !email) {
    return res.status(400).json({ error: "Email and Password is required" });
  }
  const user = await userModel.findOne({ email });
  const isValidPassword = await bcrypt.compareSync(
    password,
    user?.password || ""
  );
  if (!isValidPassword || !user) {
    return res.status(400).json({ error: "Incorrect Email or Password" });
  }

  generateTokenAndSetCookie(user._id, res);
  res.status(200).json({
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
    bio: user.bio,
  });
};

const logout = async (req, res) => {
  res.clearCookie("jwt", {
    sameSite: "none",
    httpOnly:true,
    secure: true,
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
const getMe = async (req, res) => {
  const user = await userModel.findById(req?.user?._id).select("-password");
  res.status(200).json({
    user,
  });
};

const authController = {
  signup: catchAsync(signup),
  login: catchAsync(login),
  logout: catchAsync(logout),
  getMe: catchAsync(getMe),
};

export default authController;
