import mongoose from 'mongoose';

const appointmentSlotSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

appointmentSlotSchema.index({ doctor: 1, hospital: 1, date: 1, startTime: 1 }, { unique: true });

export default mongoose.model('AppointmentSlot', appointmentSlotSchema);