import express from "express";
// import {addTourismGovern,addAdmin,addCategory,viewCategory,updateCategory,deleteCategory,addTag,deleteTag,viewTag,updateTag} from "../controllers/admin.user.controller.js";
import {findUser,deleteUser, addAdmin,addTourismGovern,addCategory,viewCategory,updateCategory,deleteCategory,addTag,deleteTag,viewTag,updateTag } from "../controllers/admin/admin.user.controller.js";
// import { validate } from "../middlewares/validation.middleware.js";
// import { createschema,adminManipulateSchema,adminUpdateSchema } from "../validation/admin.auth.validation.js";
 const router = express.Router();

router.get("/access/admin/findUser", findUser);
router.delete("/access/admin/deleteUser", deleteUser);
router.post("/access/admin/addTourismGovern", addTourismGovern);
router.post("/access/admin/addAdmin",  addAdmin);
router.post("/access/admin/addCategory",  addCategory);
router.get("/access/admin/viewCategory", viewCategory);
router.put("/access/admin/updateCategory" ,updateCategory);
router.delete("/access/admin/deleteCategory",  deleteCategory);
 router.post("/access/admin/addTag",  addTag);
 router.get("/access/admin/viewTags", viewTag);
 router.put("/access/admin/updateTag",updateTag);
 router.delete("/access/admin/deleteTag",  deleteTag);

 export default router;
