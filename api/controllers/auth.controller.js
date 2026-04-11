import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res, next) => {
  console.log("Signup Request Body:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    next(error);
  }
};

// SIGNIN
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Signin Request Body:", req.body);

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Invalid User Credentials!"));

    const secretKey = process.env.JWT_SECRET || "fallback_secret_key";

    const token = jwt.sign({ id: validUser._id }, secretKey);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error("Signin error:", error);
    next(error);
  }
};



// GOOGLE OAUTH
// GOOGLE OAUTH
export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    let user = await User.findOne({ email });

    const secretKey = process.env.JWT_SECRET || "fallback_secret_key";

    if (!user) {
      // Create new user if not exists
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      user = new User({
        username: name,
        email: email,
        password: hashedPassword,
        avatar: photo,
      });

      await user.save();
    } else {
      // Update only if name or avatar changed
      if (user.username !== name || user.avatar !== photo) {
        user.username = name;
        user.avatar = photo;
        await user.save();
      }
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, secretKey);

    const { password: pass, ...rest } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      })
      .status(200)
      .json({
        _id: user._id,
        name: user.username,
        email: user.email,
        avatar: user.avatar,
      });
  } catch (error) {
    console.error("Google auth error:", error);
    next(errorHandler(500, "Google authentication failed"));
  }
};
// SIGNOUT
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};