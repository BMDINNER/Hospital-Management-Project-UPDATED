import Hospital from '../model/Hospital.js';
import Department from '../model/Department.js';
import Doctor from '../model/Doctor.js';
import AppointmentSlot from '../model/AppointmentSlot.js';
import mongoose from 'mongoose';

const getLocations = async (req, res) => {
  try {
    const locations = await Hospital.distinct('location');
    res.json({
      success: true,
      locations: locations.filter(loc => loc && loc.trim() !== '')
    });
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getHospitalsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!location || location.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }
    
    const hospitals = await Hospital.find({ 
      location: new RegExp(location, 'i'),
      isActive: true 
    }).select('name location');
    
    res.json({
      success: true,
      hospitals
    });
  } catch (err) {
    console.error('Get hospitals error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).select('name');
    res.json({
      success: true,
      departments
    });
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getDoctorsByDepartmentAndHospital = async (req, res) => {
  try {
    const { departmentId, hospitalId } = req.params;
    
    const doctors = await Doctor.find({
      department: departmentId,
      hospital: hospitalId,
      isActive: true
    }).select('name specialty');
    
    res.json({
      success: true,
      doctors
    });
  } catch (err) {
    console.error('Get doctors error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, hospitalId, date } = req.params;
    
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);
    
    const startOfDay = new Date(slotDate);
    const endOfDay = new Date(slotDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const slots = await AppointmentSlot.find({
      doctor: doctorId,
      hospital: hospitalId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      isAvailable: true,
      isBooked: false
    }).select('startTime endTime duration isAvailable isBooked').sort({ startTime: 1 });
    
    res.json({
      success: true,
      availableSlots: slots
    });
  } catch (err) {
    console.error('Get available slots error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  getLocations,
  getHospitalsByLocation,
  getDepartments,
  getDoctorsByDepartmentAndHospital,
  getAvailableSlots
};