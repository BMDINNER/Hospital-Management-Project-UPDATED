import mongoose from 'mongoose';
import User from '../model/Users.js';
import AppointmentSlot from '../model/AppointmentSlot.js';
import Doctor from '../model/Doctor.js';
import Hospital from '../model/Hospital.js';

const addAppointment = async (req, res) => {
  try {
    const { hospitalId, departmentId, doctorId, appointmentDate, appointmentTime } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const slotDate = new Date(appointmentDate);
    slotDate.setHours(0, 0, 0, 0);
    
    const availableSlot = await AppointmentSlot.findOne({
      doctor: doctorId,
      hospital: hospitalId,
      date: slotDate,
      startTime: appointmentTime,
      isAvailable: true,
      isBooked: false
    });
    
    if (!availableSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is no longer available'
      });
    }
    
    const doctor = await Doctor.findById(doctorId).select('name specialty appointmentDuration');
    const hospital = await Hospital.findById(hospitalId).select('name location');
    
    if (!doctor || !hospital) {
      return res.status(400).json({
        success: false,
        message: 'Doctor or hospital not found'
      });
    }
    
    availableSlot.isBooked = true;
    availableSlot.isAvailable = false;
    availableSlot.bookedBy = req.userId;
    await availableSlot.save();
    
    const newAppointment = {
      hospitalId,
      hospitalName: hospital.name,
      departmentId,
      department: doctor.specialty,
      doctorId,
      doctorName: doctor.name,
      appointmentDate: slotDate,
      appointmentTime,
      location: hospital.location,
      status: 'confirmed',
      createdAt: new Date(),
      slotId: availableSlot._id
    };
    
    user.appointments.push(newAppointment);
    await user.save();
    
    const savedAppointment = user.appointments[user.appointments.length - 1];
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: savedAppointment
    });
    
  } catch (err) {
    console.error('Add appointment error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let appointments = [...user.appointments];
    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      appointments
    });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const appointment = user.appointments.id(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }
    
    if (appointment.slotId) {
      await AppointmentSlot.findByIdAndUpdate(
        appointment.slotId,
        {
          isBooked: false,
          isAvailable: true,
          bookedBy: null
        }
      );
    }
    
    appointment.status = 'cancelled';
    await user.save();
    
    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const appointment = user.appointments.id(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    const allowedUpdates = ['status', 'notes'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (err) {
    console.error('Update appointment error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  addAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointment
};