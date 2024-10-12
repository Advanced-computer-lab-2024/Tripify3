import express from "express";
import {updateUserStatus, findUser,deleteUser, addUser,addCategory,viewCategory,updateCategory,deleteCategory, getAllAcceptedUsers, getAllPendingUsers } from "../controllers/admin/admin.user.controller.js";
 import { PasswordSchema } from "../validation/users.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
 const router = express.Router();

router.get("/admin/findUser", findUser);
router.get("/users/accepted", getAllAcceptedUsers);
router.get("/users/pending", getAllPendingUsers);
router.delete("/admin/user/delete/:id", deleteUser);
router.post("/admin/user/add", addUser);
router.post("/admin/addCategory",  addCategory);
router.get("/admin/viewCategory", viewCategory);
router.put("/admin/updateCategory" ,updateCategory);
router.delete("/admin/deleteCategory",  deleteCategory);

router.put('/user/update/status/:id', updateUserStatus);


 export default router;
