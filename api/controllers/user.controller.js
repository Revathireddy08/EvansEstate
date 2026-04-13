import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const testing = (req, res) => {
  res.json({
    message: "Every programmer is an Author! ",
  });
};

export const updateUser = async (req, res, next) => {
const userId = req.user.id;

if (userId.toString() !== req.params.id)
      return next(errorHandler(401, "You can only update your own account!"));

  try {
    
   const updateUser = await User.findByIdAndUpdate(
  req.params.id,
  {
    $set: {
  username: req.body.username,
  email: req.body.email,
  avatar: req.body.avatar,
  ...(req.body.password && {
    password: bcryptjs.hashSync(req.body.password, 10),
  }),
}
  },
  { new: true }
);
    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
const userId = req.user.id?.toString();
if (userId.toString() !== req.params.id) {
  return next(errorHandler(401, "You can only delete your own account"));
}

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  const userId = req.params.id;
if (req.user.id.toString() === userId) {
    try {
      const listings = await Listing.find({ userRef: userId });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can view you own listing"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

if (!user) return next(errorHandler(404, "User Not Found"));
const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
