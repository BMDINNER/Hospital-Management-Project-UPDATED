import { expireAppointments } from '../services/appointmentService.js';

const runExpireAppointments = async () => {
  try {
    const expiredCount = await expireAppointments();
    if (expiredCount > 0) {
      console.log(`Expired ${expiredCount} appointments`);
    }
  } catch (error) {
    console.error('Error running expireAppointments:', error);
  }
};

runExpireAppointments();

setInterval(runExpireAppointments, 5000);

export { runExpireAppointments };