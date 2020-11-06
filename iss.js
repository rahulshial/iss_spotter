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

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const LAT = coords.latitude;
  const LON = coords.longitude;
  const URL = 'http://api.open-notify.org/iss-pass.json?lat=' + LAT + '&lon=' + LON;
  request(URL, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const status = JSON.parse(body).message;
    if (status !== 'success') {
      const msg = `Status Code ${status} when fetching rise times.`;
      callback(Error(msg), null);
      return;
    }

    return callback(null, (JSON.parse(body).response));
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, riseTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, riseTimes);
      });
  
    });
  });


};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
