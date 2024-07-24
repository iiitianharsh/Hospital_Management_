import { configDotenv } from "dotenv";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { User } from "../models/userSchema.js"
import { generateToken } from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

// async response (int i=0; i<nums.size() i++){
//     return response ;

// }


export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Please Fill Full Form! but kya bc"), 400)
    }

    let user = await User.findOne({ email });
    //already ye user existing hai

    if (user) {
        return next(new ErrorHandler("User Already registered."), 400)
    }
      
    user = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role })
    //generarting token
    generateToken(user, "User registered.", 200, res)

})

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    // Check if all fields are provided
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please provide All Details!", 400));
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match!", 400));
    }

    try {
        // Find the user and explicitly select the password field
        const user = await User.findOne({ email }).select("+password");

        // If user is not found
        if (!user) {
            return next(new ErrorHandler("Invalid Password or Email!", 400));
        }

        // Compare provided password with the stored hashed password
        const isPasswordMatched = await user.comparePassword(password);

        // If passwords don't match
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Password or Email", 400));
        }

        // If role doesn't match
        if (role !== user.role) {
            return next(new ErrorHandler("User role not matching", 400));
        }

        // If all checks pass, send a success response
        generateToken(user, "User Login Successfukk.", 200, res)

    } catch (error) {
        // Handle any unexpected errors
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please Fill Full Form! "), 400)
    }
    // speed test {
    //     includinng mismatch will not occur 
    // }

    const isRegistrered = await User.findOne({ email })
    if (isRegistrered) {
        return next(new ErrorHandler("Admin with this Email alredy exists!"))
    }

    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin" })
    res.status(200).json({
        success: true,
        message: "New Admin Registered",
    })

})

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});


export const  getUserDetails= catchAsyncErrors( async (req,res,next) => {
     const user = req.user;
     res.status(200).json({
        success:true,
        user,
     })
} )

export const logoutAdmin = catchAsyncErrors(async (req,res,next) => {
    res.status(200)
    .cookie("adminToken","",{
        httpOnly:true,
        expires: new Date(Date.now())
    })
    .json({
      success:true,
      message:"Logout success"
    })
} )
export const logoutPatient = catchAsyncErrors(async (req,res,next) => {
    res.status(200)
    .cookie("patientToken","",{
        httpOnly:true,
        expires: new Date(Date.now())
    })
    .json({
      success:true,
      message:"Logout success"
    })
} )

export const addNewDoctor = catchAsyncErrors(async (req,res,next) => {
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Doctor Avatar requied",400))
    }
    const {docAvatar} = req.files;

    const allowedFormats = ["image/png","image/jpeg","image/webp"]
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format not supported!",400))
    }

    const {firstName, lastName, email, phone, password, gender, doctorDepartment, dob, nic} = req.body

    //validation 
    if( !firstName || !lastName || !email || ! doctorDepartment ||  !phone || !password || !gender || !dob|| !nic){
        return next(new ErrorHandler("Please provide Full Details",400))
    }

    // check if user already exists
    const isRegistered=await User.findOne({email})

    if(isRegistered){
        return next(new ErrorHandler("Doctor already exists !",400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    )
    
    if(!cloudinaryResponse || cloudinaryResponse.error ){
         console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unkown Cloudinary error")
        }

        const doctor = await User.create({
            doctorDepartment,firstName, lastName, email, phone, password, gender, dob, nic, role:"Doctor" ,
            docAvatar:{
                public_id:cloudinaryResponse.public_id,
                url:cloudinaryResponse.secure_url,                
            }
        })
      res.status(200).json({
        success:true,
        message:"Doctor registered",
        doctor,
      })
} ) 