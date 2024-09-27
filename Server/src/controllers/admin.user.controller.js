import crypto from "crypto";
import admin from "../models/admin.js"; // Adjust the path as necessary
import tourismgovernor from "../models/TourismGoverner.js"; // Adjust the path as necessary
import nodemailer from "nodemailer";
const { default: mongoose } = require('mongoose');



// Requirment 17
export const addTourismGovern = async (req, res) => {
    
    const {username, password}=req.body;
    try{
        const newtourismgovernor= await tourismgovernor.create({username,password});
        res.status(201).json(newtourismgovernor);
        

    }catch(error){
        res.status.send("error:"+error.message);
    }
}

// requirement 18
export const addAdmin = async (req, res) => {
    
    const {username, password}=req.body;
    try{
        const newadmin= await admin.create({username,password});
        res.status(201).json(newadmin);
        

    }catch(error){
        res.status.send("error:"+error.message);
    }
}


