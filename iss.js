const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  // error can be set if invalid domain, user is offline, etc.
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    const ip = JSON.parse(body).ip;
    return callback(null, ip);
  });
};

/**
 * Makes a single API request to retrieve the geo coordinates of the IP address.
 * Input:
 *   - A callback (to pass back an error or the geo coords string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The geo coords as a string (null if error). Example:
 */

const fetchCoordsByIP = function(ip, callback) {
  request('http://ip-api.com/json/' + ip, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if invalid IP

    const status = JSON.parse(body).status;
    const statusMessage = JSON.parse(body).message;
    if (status === 'fail') {
      const msg = `Status Code ${status} when fetching IP. Response: ${statusMessage}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data..get the coords
    const coords = {
      "latitude":JSON.parse(body).lat,
      "longitude":JSON.parse(body).lon};
    return callback(null, coords);


  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};
