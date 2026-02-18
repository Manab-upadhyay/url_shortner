import { login, signup, logout, getUserById } from "./auth.service";
import { ApiError } from "../../utils/ApiError";

async function signupController(req: any, res: any) {
  const { email, password, name } = req.body;
  try {
    const { token } = await signup(email, password, name);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
}
async function loginController(req: any, res: any) {
  const { email, password } = req.body;
  try {
    const { token } = await login(email, password);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json("Login successful");
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
}
async function logoutController(req: any, res: any) {
  const userId = req.user._id;
  console.log("Logout controller called for userId:", userId);
  try {
    await logout(userId);
    res.clearCookie("token");
    return res.status(200).json("Logout successful");
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
}
async function getUserController(req: any, res: any) {
  const userId = req.user._id;
  try {
    const user = await getUserById(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
}

export {
  signupController,
  loginController,
  logoutController,
  getUserController,
};
