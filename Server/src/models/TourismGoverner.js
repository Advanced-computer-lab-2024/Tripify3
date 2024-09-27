import mongoose from "mongoose";
const schema=mongoose.schema;

const tourismgovernorschema=new schema({
    Name:{
        type:String,
        unique:true,
        required:true
    },
    Passowrd:{
        type:String,
        required:true
    }

});

const tourismgovernor=mongoose.model("TourismGoverner",tourismgovernorschema);
export default tourismgovernor;