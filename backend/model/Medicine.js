import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  genericName: {
    type: String,
    required: true,
    trim: true
  },
  dosageForms: [{
    type: String,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'inhaler', 'drops']
  }],
  strengths: [String],
  category: {
    type: String,
    enum: ['antibiotic', 'analgesic', 'anti-inflammatory', 'antihistamine', 'cardiovascular', 'gastrointestinal', 'respiratory', 'endocrine', 'vitamin', 'other']
  },
  commonUses: [String],
  sideEffects: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Medicine', medicineSchema);