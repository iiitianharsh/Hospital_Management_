import mongoose from "mongoose";
import validator from "validator";


const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        reqiured: true,
        minLength: [3, "First Name must contains 3 letters"]
    },
    lastName: {
        type: String,
        reqiured: true,
        minLength: [3, "Last Name must contains 3 letters"]
    },
    email: {
        type: String,
        reqiured: true,
        validate: [validator.isEmail, "Enter a valid email ID"]
    },
    phone: {
        type: String,
        reqiured: true,
        minLength: [10, "Phone must have 10 digits"],
        maxLength: [10, "Phone must have 10 digits"]
    },
    nic: {
        type: String,
        required: true,
        minLength: [10, "NIC must contains atleast 10 letters."],
        maxLength: [10, "NIC must contains atleast 10 letters."],
    },
    dob: {
        type: Date,
        required: [true, "DOB is requried."],
    },
    gender: {
        type: String,
        requried: true,
        enum: ["Male", "Female"],
    },
    appointment_date: {
        type: String,
         required:true, 
    },
    department:{
        type: String,
        required:true, 
    },
    doctor:{
        firstName:{
            type: String,
            required:true, 
        },
        lastName:{
            type: String,
            required:true, 
        },
    },
    hasVisitied:{
        type: Boolean,
        required:true, 
        default:false,
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    address:{
        type: String,
        required:true, 
    },
    status:{
        type: String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending",
        required:true, 
    }

})


export const Appointment = mongoose.model("Appointment",appointmentSchema );


