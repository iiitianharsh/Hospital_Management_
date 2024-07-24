import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        reqiured:true,
        minLength:[3, "First Name must contains 3 letters"]
    },
    lastName:{
        type:String,
        reqiured:true,
        minLength:[3, "Last Name must contains 3 letters"]
    },
    email:{
        type:String,
        reqiured:true,
        validate:[validator.isEmail, "Enter a valid email ID"]
    },
    phone:{
        type:String,
        reqiured:true,
        minLength:[11, "Phone must have 11 digits"],
        maxLength:[11, "Phone must have 11 digits"]
    },
    message:{
        type:String,
        required:true,
        minLength:[10, "Message must contains atleast 10 letters."],
    }
})

export const Message = mongoose.model("Message",messageSchema );
