const Logger = {};

// Output logging information to console
Logger.log = (text) => {
  const time = new Date();
  console.log(`[${time.toLocaleTimeString()}] ${text}`);
};

module.exports = Logger;
