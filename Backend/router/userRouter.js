import express from "express"
import {patientRegister, login , addNewAdmin, getAllDoctors,addNewDoctor , getUserDetails, logoutAdmin, logoutPatient} from "../controller/userController.js"
import {isAdminAuthenticated, isPatientAuthenticated} from "../middlewares/auth.js"

const router = express.Router()

router.post("/patient/register", patientRegister)
router.post("/login",login)
router.post("/admin/addnew",addNewAdmin)
  
router.get("/doctors",getAllDoctors)
router.get("/admin/me", isAdminAuthenticated, getUserDetails)
router.get("/patient/me", isPatientAuthenticated, getUserDetails)

router.get("/admin/logout",logoutAdmin, isAdminAuthenticated )
router.get("/patient/logout",logoutPatient , isPatientAuthenticated)
router.post("/doctor/addnew",addNewDoctor)

export default router;

