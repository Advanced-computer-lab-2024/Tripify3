// import express from "express";
// import {addTourismGovern,addAdmin,addCategory,viewCategory,updateCategory,deleteCategory,addTag,deleteTag,viewTag,updateTag} from "../controllers/admin.user.controller.js";
// import { validate } from "../middlewares/validation.middleware.js";
// import { createschema,adminManipulateSchema,adminUpdateSchema } from "../validation/admin.auth.validation.js";
// const router = express.Router();

// router.post("/access/admin/addTourismGovern", validate(createschema, "body"), addTourismGovern);
// router.post("/access/admin/addAdmin", validate(createschema, "body"),  addAdmin);
// router.post("/access/admin/addCategory", validate(adminManipulateSchema, "body"),  addCategory);
// router.get("/access/admin/viewCategory", viewCategory);
// router.put("/access/admin/updateCategory",validate(adminUpdateSchema, "body"),updateCategory);
// router.delete("/access/admin/deleteCategory", validate(adminManipulateSchema, "body"),  deleteCategory);
// router.post("/access/admin/addTag", validate(adminManipulateSchema, "body"),  addTag);
// router.get("/access/admin/viewTags", viewTag);
// router.put("/access/admin/updateTag",validate(adminUpdateSchema, "body"),updateTag);
// router.delete("/access/admin/deleteTag", validate(adminManipulateSchema, "body"),  deleteTag);

// export default router;
