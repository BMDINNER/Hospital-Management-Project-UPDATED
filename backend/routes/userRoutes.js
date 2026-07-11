import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import {
  registerUserInHospital,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';
import {
  addAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointment
} from '../controllers/appointmentController.js';
import {
  getPrescriptions,
  generatePrescriptionForAppointment
} from '../controllers/prescriptionController.js';

const router = express.Router();

router.post('/register', registerUserInHospital);

router.use(verifyJWT);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

router.get('/appointments', getAppointments);
router.post('/appointments', addAppointment);
router.delete('/appointments/:appointmentId', cancelAppointment);
router.put('/appointments/:appointmentId', updateAppointment);

router.get('/prescriptions', getPrescriptions);
router.post('/prescriptions/generate/:appointmentId', generatePrescriptionForAppointment);

export default router;