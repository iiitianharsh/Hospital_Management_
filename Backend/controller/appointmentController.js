import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { Appointment } from "../models/appointmentSchema.js"
import {User} from "../models/userSchema.js"

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisitied,
        address,
    } = req.body

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !hasVisitied ||
        !address
    ) {
       return next(new ErrorHandler("Please Fill Full Form !",400))
    }

    //validation on doctor -> 
    const isConflict = await User.find({
         firstName:doctor_firstName,
         lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment:department 
    })
    if(isConflict.length===0){
        return next(new ErrorHandler("Doctor Not Found!",400))
    }
    if(isConflict.length > 1){
        return next(new ErrorHandler("Doctor's Conflict Please contact through Email!",404))
    }
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id

      const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
             firstName:doctor_firstName,
             lastName: doctor_lastName,
        },
        hasVisitied,
        address,
        doctorId,
        patientId,
      })
     res.status(200).json({
        success:true,
        message:"Appoint done ready khallas!! ",
        appointment
     })  
})

export const getAllAppointments = catchAsyncErrors(async (req,res,next) => {
    const appointments = await Appointment.find()
    res.status(200).json({
        success:true,
        appointments,
    })
}) 

export const updateAppointmentStatus = catchAsyncErrors(async (req , res, next) => {
   const {id} = req.params;
   let appointment = await Appointment.findById(id)
   if(!appointment){
    return next(new ErrorHandler ("Appointment Not Found!",400) )
   }    
   //updating the appointment   
   appointment = await Appointment.findByIdAndUpdate(id , req.body, {  //req.body pe jo bhi hoga wo update ho jaega 
    new:true,
    runValidators:true,
    useFindandModify:false,
   })
   res.status(200).json({
    success:true,
    appointment,
    message:"Apppointment Status updated",
   })    

}) 

export const deleteAppointment = catchAsyncErrors (async (req,res,next) => {
    const {id} = req.body

    let appointment= await Appointment.findById(id)
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found !",400))
    } 

    await appointment.deleteOne()
     res.status(200).json({
        success:true,
        message:"Appointment Deleted Auccess !"
     })
} )