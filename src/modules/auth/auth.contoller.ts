import { login, signup, logout, getUserById } from "./auth.service";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asynchanddler";

const signupController = asyncHandler(async (req: any, res: any) => {
  const { email, password, name } = req.body;

  const { token } = await signup(email, password, name);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(201).json({ message: "User created successfully" });
});
const loginController = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const { token } = await login(email, password);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json("Login successful");
});
const logoutController = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  await logout(userId);
  res.clearCookie("token");
  return res.status(200).json("Logout successful");
});
const getUserController = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const user = await getUserById(userId);
  return res.status(200).json(user);
});

export {
  signupController,
  loginController,
  logoutController,
  getUserController,
};
