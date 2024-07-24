import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
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
        minLength:[10, "Phone must have 10 digits"],
        maxLength:[10, "Phone must have 10 digits"]
    },
    nic:{
        type:String,
        required:true,
        minLength:[10, "NIC must contains atleast 10 letters."],
        maxLength:[10, "NIC must contains atleast 10 letters."],
    },
    dob:{
        type:Date,
        required:[true, "DOB is requried."],
    },
    gender:{
        type:String,
        requried:true,
        enum:["Male","Female"],  
    },
     password:{
        type:String,
        minLength:[8, "Password must contains 8 letters."],
        required:true,
        select:false,

     },
     role:{
      type:String,
      requried:true,
      enum:["Admin","Patient","Doctor"], 
     },
     doctorDepartment:{
        type:String,
     },
     docAvatar:{
        public_id:String,
        url:String,
     },

})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

export const User = mongoose.model("User",userSchema );
