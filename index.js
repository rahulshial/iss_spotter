const { fetchMyIP, fetchCoordsByIP } = require('./iss');

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

// It worked! Returned coords: { latitude: 50.9129, longitude: 50.9129 }


