const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);
});

const ip = '70.77.2.242';

fetchCoordsByIP(ip, (error, coords) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned coords:' , coords);
});

const coords = { latitude: 50.9129, longitude: -114.1028 };

fetchISSFlyOverTimes(coords, (error, riseTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned coords:' , riseTimes);
});

