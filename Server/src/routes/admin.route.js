import express from "express";
import {updateUserStatus, findUser,deleteUser, addUser,addCategory,getAllCategories,updateCategory,deleteCategory, getAllAcceptedUsers, getAllPendingUsers } from "../controllers/admin/admin.user.controller.js";
import {getAllComplaints, getComplaintById, markStatus } from "../controllers/admin/admin.complaint.controller.js";
 const router = express.Router();

router.get("/admin/findUser", findUser);
router.get("/users/accepted", getAllAcceptedUsers);
router.get("/users/pending", getAllPendingUsers);
router.delete("/admin/user/delete/:id", deleteUser);
router.post("/admin/user/add", addUser);
router.post("/admin/category/create",  addCategory);
router.get("/category/get", getAllCategories);
router.put("/admin/category/update" ,updateCategory);
router.delete("/admin/category/delete",  deleteCategory);
router.get("/admin/complaints/get", getAllComplaints);
router.get("/admin/complaint/get/:id", getComplaintById);
router.put("/admin/complaint/mark-status/:id", markStatus);

router.put('/user/update/status/:id', updateUserStatus);


 export default router;
