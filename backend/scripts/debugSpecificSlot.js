const connectDB = require('../config/database');
require('../model/index');

const AppointmentSlot = require('../model/AppointmentSlot');
const Doctor = require('../model/Doctor');
const Hospital = require('../model/Hospital');

require('dotenv').config();

const debugSpecificSlots = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const sarah = await Doctor.findOne({ name: 'Dr. Sarah Johnson' });
    console.log('Dr. Sarah Johnson ID:', sarah?._id);

    const cedars = await Hospital.findOne({ name: /Cedars-Sinai/i });
    console.log('Cedars-Sinai ID:', cedars?._id);

    if (sarah && cedars) {
      const monday = new Date();
      while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() + 1);
      }
      monday.setHours(0, 0, 0, 0);

      console.log(`\nChecking Monday: ${monday.toDateString()}`);
      console.log('Monday YYYY-MM-DD:', monday.toISOString().split('T')[0]);

      const startOfDay = new Date(monday);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(monday);
      endOfDay.setHours(23, 59, 59, 999);

      const mondaySlots = await AppointmentSlot.find({
        doctor: sarah._id,
        hospital: cedars._id,
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })
      .sort('startTime');

      console.log(`\nAll Monday slots (${mondaySlots.length}):`);
      mondaySlots.forEach(slot => {
        console.log(`- ${slot.startTime}-${slot.endTime} (Available: ${slot.isAvailable}, Booked: ${slot.isBooked}, Duration: ${slot.duration}min)`);
      });

      const availableMondaySlots = mondaySlots.filter(slot => 
        slot.isAvailable && !slot.isBooked
      );

      console.log(`\nAvailable Monday slots (${availableMondaySlots.length}):`);
      availableMondaySlots.forEach(slot => {
        console.log(`- ${slot.startTime}-${slot.endTime} (${slot.duration}min)`);
      });

      const testDate = monday.toISOString().split('T')[0];
      console.log(`\nTesting API query with date: ${testDate}`);
      
      const apiStart = new Date(testDate + 'T00:00:00.000Z');
      const apiEnd = new Date(testDate + 'T23:59:59.999Z');

      const apiSlots = await AppointmentSlot.find({
        doctor: sarah._id,
        hospital: cedars._id,
        date: {
          $gte: apiStart,
          $lte: apiEnd
        },
        isAvailable: true,
        isBooked: false
      })
      .select('startTime endTime duration isAvailable isBooked')
      .sort('startTime');

      console.log(`API would return ${apiSlots.length} slots:`);
      apiSlots.forEach(slot => {
        console.log(`- ${slot.startTime}-${slot.endTime} (${slot.duration}min, Available: ${slot.isAvailable}, Booked: ${slot.isBooked})`);
      });

      console.log(`\nChecking all slots for Dr. Sarah Johnson at Cedars-Sinai...`);
      const allSlots = await AppointmentSlot.find({
        doctor: sarah._id,
        hospital: cedars._id
      })
      .sort('date startTime')
      .limit(10);

      console.log(`Found ${allSlots.length} total slots (showing first 10):`);
      allSlots.forEach(slot => {
        console.log(`- ${slot.date.toISOString().split('T')[0]} ${slot.startTime}-${slot.endTime} (Available: ${slot.isAvailable}, Booked: ${slot.isBooked})`);
      });
    } else {
      console.log('Doctor or hospital not found - run seedData.js first');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error debugging slots:', err);
    process.exit(1);
  }
};

debugSpecificSlots();