import express from "express"
import {getAllAppointments, postAppointment, updateAppointmentStatus, deleteAppointment} from "../controller/appointmentController.js"
import { isPatientAuthenticated, isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router()

router.post("/post",postAppointment,isPatientAuthenticated );
router.get("/getall",isAdminAuthenticated,getAllAppointments );

router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus );
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment );

export default router   