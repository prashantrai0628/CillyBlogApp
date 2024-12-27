import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
  try {
    // Generate JWT token with a 30-day expiration
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    // Set the token as a cookie with secure production settings
    res.cookie("jwt", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: true, // Requires HTTPS (production-ready)
      sameSite: "none", // Allows cross-origin requests
      path: "/", // Makes the cookie accessible site-wide
    });

    // Save the token in the user's record in the database
    await User.findByIdAndUpdate(userId, { token });

    return token;
  } catch (error) {
    console.error("Error creating token and saving cookies:", error);
    throw new Error("Failed to create token and save cookies");
  }
};

export default createTokenAndSaveCookies;
