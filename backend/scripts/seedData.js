import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Department from '../model/Department.js';
import Hospital from '../model/Hospital.js';
import Doctor from '../model/Doctor.js';
import AppointmentSlot from '../model/AppointmentSlot.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Department.deleteMany({});
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await AppointmentSlot.deleteMany({});

    const departments = await Department.insertMany([
      { name: 'Cardiology', description: 'Heart and cardiovascular system specialists' },
      { name: 'Dermatology', description: 'Skin, hair, and nail specialists' },
      { name: 'Neurology', description: 'Brain and nervous system specialists' },
      { name: 'Orthopedics', description: 'Bone and joint specialists' },
      { name: 'Pediatrics', description: 'Child healthcare specialists' },
      { name: 'Oncology', description: 'Cancer treatment specialists' },
      { name: 'Gynecology', description: 'Women health specialists' },
      { name: 'Psychiatry', description: 'Mental health specialists' }
    ]);

    const hospitals = await Hospital.insertMany([
      {
        name: 'NewYork-Presbyterian Hospital',
        location: 'New York',
        address: { street: '525 E 68th St', city: 'New York', state: 'NY', zipCode: '10065' },
        phone: '(212) 746-5454',
        email: 'info@nyp.org'
      },
      {
        name: 'Mount Sinai Hospital',
        location: 'New York',
        address: { street: '1 Gustave L Levy Pl', city: 'New York', state: 'NY', zipCode: '10029' },
        phone: '(212) 241-6500',
        email: 'info@mountsinai.org'
      },
      {
        name: 'Cedars-Sinai Medical Center',
        location: 'Los Angeles',
        address: { street: '8700 Beverly Blvd', city: 'Los Angeles', state: 'CA', zipCode: '90048' },
        phone: '(310) 423-5000',
        email: 'info@csmc.edu'
      },
      {
        name: 'UCLA Medical Center',
        location: 'Los Angeles',
        address: { street: '757 Westwood Plaza', city: 'Los Angeles', state: 'CA', zipCode: '90095' },
        phone: '(310) 825-9111',
        email: 'info@uclahealth.org'
      }
    ]);

    const getDeptId = (name) => departments.find(d => d.name === name)._id;

    const availability = [
      { dayOfWeek: 0, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }
    ];

    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        department: getDeptId('Cardiology'),
        hospital: hospitals[0]._id,
        email: 's.johnson@hospital.com',
        phone: '(555) 100-1001',
        experience: 15,
        qualifications: ['MD', 'FACC'],
        consultationFee: 200,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Cardiac Surgeon',
        department: getDeptId('Cardiology'),
        hospital: hospitals[1]._id,
        email: 'm.chen@hospital.com',
        phone: '(555) 100-1002',
        experience: 20,
        qualifications: ['MD', 'FACS'],
        consultationFee: 300,
        availability: availability,
        appointmentDuration: 45
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'Dermatologist',
        department: getDeptId('Dermatology'),
        hospital: hospitals[0]._id,
        email: 'j.wilson@hospital.com',
        phone: '(555) 100-2001',
        experience: 10,
        qualifications: ['MD', 'FAAD'],
        consultationFee: 180,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Maria Garcia',
        specialty: 'Cosmetic Dermatologist',
        department: getDeptId('Dermatology'),
        hospital: hospitals[1]._id,
        email: 'm.garcia@hospital.com',
        phone: '(555) 100-2002',
        experience: 8,
        qualifications: ['MD', 'FAAD'],
        consultationFee: 220,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Benjamin Carter',
        specialty: 'Neurologist',
        department: getDeptId('Neurology'),
        hospital: hospitals[0]._id,
        email: 'b.carter@hospital.com',
        phone: '(555) 100-3001',
        experience: 12,
        qualifications: ['MD', 'FAAN'],
        consultationFee: 210,
        availability: availability,
        appointmentDuration: 45
      },
      {
        name: 'Dr. Jennifer Lee',
        specialty: 'Neurosurgeon',
        department: getDeptId('Neurology'),
        hospital: hospitals[2]._id,
        email: 'j.lee@hospital.com',
        phone: '(555) 100-3002',
        experience: 18,
        qualifications: ['MD', 'FACS'],
        consultationFee: 350,
        availability: availability,
        appointmentDuration: 60
      },
      {
        name: 'Dr. David Martinez',
        specialty: 'Orthopedic Surgeon',
        department: getDeptId('Orthopedics'),
        hospital: hospitals[1]._id,
        email: 'd.martinez@hospital.com',
        phone: '(555) 100-4001',
        experience: 14,
        qualifications: ['MD', 'FAAOS'],
        consultationFee: 240,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Amanda Foster',
        specialty: 'Sports Medicine',
        department: getDeptId('Orthopedics'),
        hospital: hospitals[3]._id,
        email: 'a.foster@hospital.com',
        phone: '(555) 100-4002',
        experience: 9,
        qualifications: ['MD'],
        consultationFee: 200,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Rachel Green',
        specialty: 'Pediatrician',
        department: getDeptId('Pediatrics'),
        hospital: hospitals[0]._id,
        email: 'r.green@hospital.com',
        phone: '(555) 100-5001',
        experience: 11,
        qualifications: ['MD', 'FAAP'],
        consultationFee: 160,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Kevin Patel',
        specialty: 'Pediatric Specialist',
        department: getDeptId('Pediatrics'),
        hospital: hospitals[2]._id,
        email: 'k.patel@hospital.com',
        phone: '(555) 100-5002',
        experience: 13,
        qualifications: ['MD', 'FAAP'],
        consultationFee: 170,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Susan Wong',
        specialty: 'Oncologist',
        department: getDeptId('Oncology'),
        hospital: hospitals[1]._id,
        email: 's.wong@hospital.com',
        phone: '(555) 100-6001',
        experience: 16,
        qualifications: ['MD', 'FACP'],
        consultationFee: 280,
        availability: availability,
        appointmentDuration: 45
      },
      {
        name: 'Dr. Richard Brown',
        specialty: 'Radiation Oncologist',
        department: getDeptId('Oncology'),
        hospital: hospitals[3]._id,
        email: 'r.brown@hospital.com',
        phone: '(555) 100-6002',
        experience: 19,
        qualifications: ['MD'],
        consultationFee: 320,
        availability: availability,
        appointmentDuration: 60
      },
      {
        name: 'Dr. Lisa Taylor',
        specialty: 'Gynecologist',
        department: getDeptId('Gynecology'),
        hospital: hospitals[0]._id,
        email: 'l.taylor@hospital.com',
        phone: '(555) 100-7001',
        experience: 12,
        qualifications: ['MD', 'FACOG'],
        consultationFee: 190,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Christopher Evans',
        specialty: 'OB/GYN',
        department: getDeptId('Gynecology'),
        hospital: hospitals[2]._id,
        email: 'c.evans@hospital.com',
        phone: '(555) 100-7002',
        experience: 15,
        qualifications: ['MD', 'FACOG'],
        consultationFee: 210,
        availability: availability,
        appointmentDuration: 30
      },
      {
        name: 'Dr. Michelle Scott',
        specialty: 'Psychiatrist',
        department: getDeptId('Psychiatry'),
        hospital: hospitals[1]._id,
        email: 'm.scott@hospital.com',
        phone: '(555) 100-8001',
        experience: 10,
        qualifications: ['MD'],
        consultationFee: 180,
        availability: availability,
        appointmentDuration: 60
      },
      {
        name: 'Dr. Daniel Harris',
        specialty: 'Clinical Psychiatrist',
        department: getDeptId('Psychiatry'),
        hospital: hospitals[3]._id,
        email: 'd.harris@hospital.com',
        phone: '(555) 100-8002',
        experience: 14,
        qualifications: ['MD'],
        consultationFee: 200,
        availability: availability,
        appointmentDuration: 60
      }
    ]);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const appointmentSlots = [];

    for (const doctor of doctors) {
      for (let day = 0; day < 30; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        
        const slotDate = new Date(currentDate);
        slotDate.setHours(0, 0, 0, 0);
        
        const dayOfWeek = currentDate.getDay();
        const avail = availability.find(a => a.dayOfWeek === dayOfWeek);
        
        if (!avail) continue;
        
        const [startHour] = avail.startTime.split(':').map(Number);
        const [endHour] = avail.endTime.split(':').map(Number);
        const duration = doctor.appointmentDuration || 30;
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += duration) {
            const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const endMinute = minute + duration;
            const endHourTime = endMinute >= 60 ? hour + 1 : hour;
            const endMinuteTime = endMinute % 60;
            const endTime = `${endHourTime.toString().padStart(2, '0')}:${endMinuteTime.toString().padStart(2, '0')}`;
            
            appointmentSlots.push({
              doctor: doctor._id,
              hospital: doctor.hospital,
              date: slotDate,
              startTime: startTime,
              endTime: endTime,
              duration: duration,
              isBooked: false,
              isAvailable: true,
              bookedBy: null
            });
          }
        }
      }
    }

    const batchSize = 1000;
    for (let i = 0; i < appointmentSlots.length; i += batchSize) {
      const batch = appointmentSlots.slice(i, i + batchSize);
      await AppointmentSlot.insertMany(batch);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();