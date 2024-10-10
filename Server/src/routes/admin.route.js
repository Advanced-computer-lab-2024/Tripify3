import express from "express";
import {findUser,deleteUser, addAdmin, addTourismGovernor,addCategory,viewCategory,updateCategory,deleteCategory,addTag,deleteTag,viewTag,updateTag } from "../controllers/admin/admin.user.controller.js";
 import { PasswordSchema } from "../validation/users.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
 const router = express.Router();

router.get("/admin/findUser", findUser);
router.delete("/admin/deleteUser", deleteUser);
router.post("/admin/addTourismGovern",validate(PasswordSchema,"body"), addTourismGovernor);
router.post("/admin/addAdmin",validate(PasswordSchema,"body") , addAdmin);
router.post("/admin/addCategory",  addCategory);
router.get("/admin/viewCategory", viewCategory);
router.put("/admin/updateCategory" ,updateCategory);
router.delete("/admin/deleteCategory",  deleteCategory);
 router.post("/admin/addTag",  addTag);
 router.get("/admin/viewTags", viewTag);
 router.put("/admin/updateTag",updateTag);
 router.delete("/admin/deleteTag",  deleteTag);

 export default router;
