// Retrieve configuration keys
const { DEBUG_LOGGING } = require('./../../config/keys');

const Logger = {};

// Output logging information to console
Logger.log = (text) => {
  if (DEBUG_LOGGING) {
    const time = new Date();
    console.log(`[${time.toLocaleTimeString()}] ${text}`);
  }
};

module.exports = Logger;
