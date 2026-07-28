import User from '../model/Users.js';
import Prescription from '../model/Prescription.js';
import Medicine from '../model/Medicine.js';

const generateDiagnosis = (department) => {
  const diagnoses = {
    'Cardiology': ['Hypertension', 'Coronary artery disease', 'Arrhythmia', 'Heart failure'],
    'Dermatology': ['Acne vulgaris', 'Eczema', 'Psoriasis', 'Contact dermatitis'],
    'Neurology': ['Migraine', 'Tension headache', 'Neuropathy', 'Insomnia'],
    'Orthopedics': ['Osteoarthritis', 'Back pain', 'Sprain', 'Tendinitis'],
    'Pediatrics': ['Upper respiratory infection', 'Ear infection', 'Viral illness', 'Allergic rhinitis'],
    'Oncology': ['Follow-up care', 'Symptom management', 'Treatment monitoring'],
    'Gynecology': ['Menstrual disorder', 'UTI', 'Vaginal infection', 'Contraception management'],
    'Psychiatry': ['Anxiety disorder', 'Depression', 'Insomnia', 'Stress management']
  };
  const deptDiagnoses = diagnoses[department] || ['General medical condition'];
  return deptDiagnoses[Math.floor(Math.random() * deptDiagnoses.length)];
};

const generatePrescription = async (appointment, userId) => {
  try {
    const existingPrescription = await Prescription.findOne({ appointmentId: appointment._id });
    if (existingPrescription) {
      return existingPrescription;
    }

    const medicineCount = Math.floor(Math.random() * 3) + 1;
    const allMedicines = await Medicine.find({ isActive: true });
    
    if (allMedicines.length === 0) {
      return null;
    }
    
    const shuffledMedicines = [...allMedicines].sort(() => 0.5 - Math.random());
    const selectedMedicines = shuffledMedicines.slice(0, medicineCount);
    
    const frequencies = ['once daily', 'twice daily', 'three times daily', 'four times daily', 'as needed'];
    const durations = ['7 days', '10 days', '14 days', '30 days', 'As needed'];
    
    const medications = selectedMedicines.map(med => ({
      name: med.name,
      genericName: med.genericName,
      dosage: med.strengths ? med.strengths[Math.floor(Math.random() * med.strengths.length)] + ' ' + frequencies[Math.floor(Math.random() * frequencies.length)] : 'As directed',
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      duration: durations[Math.floor(Math.random() * durations.length)],
      category: med.category,
      instructions: 'Take as prescribed by your physician'
    }));
    
    const instructionOptions = [
      'Complete the full course of medication',
      'Return if symptoms worsen',
      'Avoid alcohol while taking this medication',
      'May cause drowsiness - avoid driving',
      'Take with plenty of water',
      'Store at room temperature away from moisture',
      'Follow up if no improvement in 3 days'
    ];
    
    const prescriptionData = {
      appointmentId: appointment._id,
      userId: userId,
      hospitalName: appointment.hospitalName,
      department: appointment.department,
      doctorName: appointment.doctorName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      diagnosis: generateDiagnosis(appointment.department),
      medications: medications,
      instructions: instructionOptions[Math.floor(Math.random() * instructionOptions.length)],
      followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      prescribedAt: new Date(),
      status: 'active'
    };
    
    const prescription = new Prescription(prescriptionData);
    await prescription.save();
    
    return prescription;
  } catch (error) {
    console.error('Error generating prescription:', error);
    throw error;
  }
};

const cancelAppointment = async (userId, appointmentId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const appointmentIndex = user.appointments.findIndex(
      app => app._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      throw new Error('Appointment not found');
    }

    const appointment = user.appointments[appointmentIndex];
    if (appointment.status === 'completed') {
      throw new Error('Cannot cancel a completed appointment');
    }
    if (appointment.status === 'cancelled') {
      throw new Error('Appointment is already cancelled');
    }

    user.appointments[appointmentIndex].status = 'cancelled';
    await user.save();

    return user;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

const expireAppointments = async () => {
  try {
    const users = await User.find({
      'appointments.status': 'confirmed'
    });
    
    let expiredCount = 0;
    let foundAppointments = 0;
    
    for (const user of users) {
      let shouldSave = false;
      
      for (const appointment of user.appointments) {
        if (appointment.status === 'confirmed') {
          foundAppointments++;
          
          const createdAt = new Date(appointment.createdAt);
          const now = new Date();
          const timeDiff = (now - createdAt) / 1000; 
          
          console.log(`Appointment ${appointment._id}: created at ${createdAt}, now ${now}, diff ${timeDiff}s`);
          
          if (timeDiff > 15) {
            console.log(`Expiring appointment: ${appointment._id}, created at: ${createdAt}, diff: ${timeDiff}s`);
            
            appointment.status = 'completed';
            
            try {
              const prescription = await generatePrescription(appointment, user._id);
              if (prescription) {
                appointment.prescriptionId = prescription._id;
                console.log(`Prescription generated for appointment ${appointment._id}`);
              }
            } catch (error) {
              console.error(`Failed to generate prescription for appointment ${appointment._id}:`, error);
            }
            
            shouldSave = true;
            expiredCount++;
          }
        }
      }
      
      if (shouldSave) {
        await user.save();
        console.log(`Saved user ${user._id} with expired appointments`);
      }
    }
    
    console.log(`Expire appointments completed: ${expiredCount} expired out of ${foundAppointments} found`);
    return expiredCount;
  } catch (error) {
    console.error('Error in expireAppointments:', error);
    throw error;
  }
};

const completeAppointment = async (userId, appointmentId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const appointmentIndex = user.appointments.findIndex(
      app => app._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      throw new Error('Appointment not found');
    }

    const appointment = user.appointments[appointmentIndex];
    
    if (appointment.status !== 'confirmed') {
      throw new Error('Only confirmed appointments can be completed');
    }

    appointment.status = 'completed';
    
    try {
      const prescription = await generatePrescription(appointment, user._id);
      if (prescription) {
        appointment.prescriptionId = prescription._id;
      }
    } catch (error) {
      console.error(`Failed to generate prescription for appointment ${appointment._id}:`, error);
    }
    
    await user.save();
    
    return user;
  } catch (error) {
    console.error('Error completing appointment:', error);
    throw error;
  }
};

export { expireAppointments, generatePrescription, cancelAppointment, completeAppointment };