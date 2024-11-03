import express from "express";
import {
  updateUserStatus,
  findUser,
  deleteUser,
  addUser,
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getAllAcceptedUsers,
  getAllPendingUsers,
  replyToComplaint,
  sortComplaintsByDate,
  filterComplaintsByStatus,
} from "../controllers/admin/admin.user.controller.js";
import { PasswordSchema } from "../validation/users.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
const router = express.Router();

router.get("/admin/findUser", findUser);
router.get("/users/accepted", getAllAcceptedUsers);
router.get("/users/pending", getAllPendingUsers);
router.delete("/admin/user/delete/:id", deleteUser);
router.post("/admin/user/add", addUser);
router.post("/admin/category/create", addCategory);
router.get("/category/get", getAllCategories);
router.put("/admin/category/update", updateCategory);
router.delete("/admin/category/delete", deleteCategory);
router.put("/user/update/status/:id", updateUserStatus);
router.put("/complaint/reply/:complaintId", replyToComplaint);
router.get("/complaint/sort", sortComplaintsByDate);
router.get("/complaint/filter", filterComplaintsByStatus);

export default router;
