import { loginService, signupService, changePasswordService } from "../service/tourist.user.service.js";

const login = async (req, res) => {
  try {
    const reqData = req.body;
    // const userId = req.headers.token ? await extractUserId(req.headers.token) : null;
    const userId = req.body.id;
    const changedDetails = await loginService(userId, reqData);
    res.status(200).json(changedDetails);
  } catch (err) {
    res.status(404).json(err);
  }
};

const signup = async (req, res) => {
  try {
    // const token = req.headers.token;
    // let userId = await extractUserId(token);
    const reqData = req.body;
    const resetPassword = await signupService(reqData);
    res.status(200).json(resetPassword);
  } catch (err) {
    res.status(404).json(err);
  }
};

const changePassword = async (req, res) => {
  try {
    // const token = req.headers.token;
    // let userId = await extractUserId(token);
    const reqData = req.body;
    const userId = req.body.id;
    const resetPassword = await changePasswordService(userId, reqData);
    res.status(200).json(resetPassword);
  } catch (err) {
    res.status(404).json(err);
  }
};

// Export the functions as an object
export default {
  login,
  signup,
  changePassword,
};
