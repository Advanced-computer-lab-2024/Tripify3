import express from "express";
import {markActivityInappropriate,updateUserStatus, findUser,deleteUser, addUser,addCategory,getAllCategories,updateCategory,deleteCategory, getAllAcceptedUsers, getAllPendingUsers, createPromoCode, getAllUsersWithJoinDate } from "../controllers/admin/admin.user.controller.js";
import {getComplaintById, markStatus } from "../controllers/admin/admin.complaint.controller.js";
 const router = express.Router();
router.get('/admin/getAllUsers', getAllUsersWithJoinDate);
router.get("/admin/findUser", findUser);
router.get("/users/accepted", getAllAcceptedUsers);
router.get("/users/pending", getAllPendingUsers);
router.delete("/admin/user/delete/:id", deleteUser);
router.post("/admin/user/add", addUser);
router.post("/admin/category/create", addCategory);
router.get("/categories/get", getAllCategories);
router.put("/admin/category/update", updateCategory);
router.delete("/admin/category/delete", deleteCategory);
router.put("/user/update/status/:id", updateUserStatus);
router.put("/admin/category/update" ,updateCategory);
router.delete("/admin/category/delete",  deleteCategory);
router.get("/admin/complaint/get/:id", getComplaintById);
router.put("/admin/complaint/mark-status/:id", markStatus);
router.put("/activity/inappropriate/:id", markActivityInappropriate);

router.post("/admin/promocode", createPromoCode);

export default router;
