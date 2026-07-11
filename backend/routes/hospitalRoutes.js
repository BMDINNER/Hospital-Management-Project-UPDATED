import express from 'express';
import {
  getLocations,
  getHospitalsByLocation,
  getDepartments,
  getDoctorsByDepartmentAndHospital,
  getAvailableSlots
} from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/locations', getLocations);
router.get('/hospitals/:location', getHospitalsByLocation);
router.get('/departments', getDepartments);
router.get('/doctors/:departmentId/:hospitalId', getDoctorsByDepartmentAndHospital);
router.get('/slots/:doctorId/:hospitalId/:date', getAvailableSlots);

export default router;