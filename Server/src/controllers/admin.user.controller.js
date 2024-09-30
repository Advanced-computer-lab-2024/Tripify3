// import admin from "../models/admin.js"; // Adjust the path as necessary
// import category from "../models/CategoriesList.js"; // Adjust the path as necessary
// import tags from "../models/tagsList.js"; // Adjust the path as necessary
// import tourismgovernor from "../models/TourismGoverner.js"; // Adjust the path as necessary

// // Requirment 16 i think we can searchh for the user using his type in each table and that we can take it from the front end through the body

// // Requirment 17
// export const addTourismGovern = async (req, res) => {

//     const {username, password}=req.body;
//     try{
//         const newtourismgovernor= await tourismgovernor.create({username,password});
//         res.status(201).json(newtourismgovernor);

//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// }

// // requirement 18
// export const addAdmin = async (req, res) => {

//     const {username, password}=req.body;
//     try{
//         const newadmin= await admin.create({username,password});
//         res.status(201).json(newadmin);

//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// }

// // requirement 19
// export const addCategory = async (req, res) => {
//     const {name}=req.body;
//     try{
//         const newcategory= await category.create({name});
//         res.status(201).json(newcategory);

//     }
//     catch(error){
//         res.status(500).json({message: error.message});

//     }

// }

// export const viewCategory = async (req, res) => {
//     try{
//         const categories= await category.find();
//         res.status(200).json(categories);

//     }
//     catch(error){
//         res.status(404).json({message: error.message});

//     }

// }
// export const updateCategory = async (req, res) => {
//     const {oldName , newName}=req.body;
//     try{
//         const updatedcategory= await category.findOneAndUpdate( {name:oldName} , {name:newName} , {new:true}) ;
//         res.status(200).json(updatedcategory);
//     }
//     catch(error){
//         res.status(404).json({message: error.message});

//     }
// }

// export const deleteCategory = async (req, res) => {
//     const {name}=req.body;
//     try{
//         const deletedcategory= await category.findOneAndDelete({name});
//         res.status(200).json(deletedcategory);

//     }
//     catch(error){
//         res.status(404).json({message: error.message});

//     }

// }
// export const addTag = async (req, res) => {
//     const {name}=req.body;
//     try{
//         const newtag= await tags.create({name});
//         res.status(201).json(newtag);

//     }
//     catch(error){
//         res.status(500).json({message: error.message});

//     }

// }

// export const viewTag = async (req, res) => {
//     try{
//         const tag= await tags.find();
//         res.status(200).json(tag);

//     }
//     catch(error){
//         res.status(404).json({message: error.message});

//     }

// }
// export const updateTag = async (req, res) => {
//     const {oldName , newName}=req.body;
//     try{
//         const updatedtag= await tags.findOneAndUpdate( {name:oldName} , {name:newName} , {new:true}) ;
//         res.status(200).json(updatedtag);
//     }
//     catch(error){
//         res.status(404).json({message: error.message});

//     }
// }

// export const deleteTag = async (req, res) => {
//     const {name}=req.body;
//     try{
//         const deletedtag= await tags.findOneAndDelete({name});
//         res.status(200).json(deletedtag);

//     }
//     catch(error){
//         res.status(404).json({message: error.message});

//     }

// }
