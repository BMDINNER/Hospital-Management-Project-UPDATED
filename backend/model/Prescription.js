import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  category: String,
  instructions: String
});

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  medications: [medicationSchema],
  instructions: {
    type: String,
    required: true
  },
  followUpDate: Date,
  prescribedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Prescription', prescriptionSchema);