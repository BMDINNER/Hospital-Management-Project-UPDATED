const { expireAppointments } = require('./appointmentService');

class AppointmentScheduler {
  constructor() {
    this.interval = null;
    console.log('AppointmentScheduler initialized');
  }

  start() {
    console.log('Starting appointment scheduler...');
    
    this.interval = setInterval(async () => {
      try {
        console.log('Scheduled appointment check running...');
        await expireAppointments();
      } catch (error) {
        console.error('Error in appointment scheduler:', error);
      }
    }, 10000);
    
    setTimeout(() => {
      console.log('Running initial appointment check...');
      expireAppointments().catch(err => 
        console.error('Initial appointment check failed:', err)
      );
    }, 2000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Appointment scheduler stopped');
    } else {
      console.log('Appointment scheduler was not running');
    }
  }

  isRunning() {
    return this.interval !== null;
  }

  getStatus() {
    return {
      running: this.isRunning(),
      type: 'interval',
      interval: this.isRunning() ? 10000 : null
    };
  }
}

module.exports = new AppointmentScheduler();