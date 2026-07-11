const mongoose = require('mongoose');

require('./Department');
require('./Hospital');
require('./Doctor');
require('./AppointmentSlot');
require('./Medicine');
require('./Prescription');
require('./Users');

module.exports = mongoose;