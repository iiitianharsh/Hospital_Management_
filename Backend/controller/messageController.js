import { Message } from "../models/messageSchema.js"; // Ensure the correct path and file extension
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;
        
    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorHandler("Please Fill Out Form!"), 400)
    } 

    try {
        await Message.create({ firstName, lastName, email, phone, message });
        res.status(200).json({
            success: true,
            message: "Message sent successfully.",
        });
    } catch (error) {   
        next(error); // Passes errors to the error handling middleware
    }
})

export const getAllMessages = catchAsyncErrors(async (req,res,next) => {
    const messages = await Message.find()
    res.status(200).json({
        success:true,
        messages,
    })
})  

