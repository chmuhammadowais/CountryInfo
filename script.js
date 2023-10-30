'use strict'
const find = document.getElementById('find');
const container = document.getElementById('container');
const loader = document.getElementById('loader'); // Reference to the loader element

find.addEventListener('click', function () {
 loader.style.display = 'block'; // Display the loader before making the geolocation request

  // getLoc()
  //   .then((res) => {
  //     console.log(res);
  //     loader.style.display = 'none'; // Hide the loader when the request is successful
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     loader.style.display = 'none'; // Hide the loader when there's an error
  //   });
 findMe();
});

const getLoc = function () {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    return new Promise((_, reject) =>
      reject('Geolocation is not supported by this browser')
    );
  }
};
const getCountry = async function(){
  const pos = await getLoc().then(coords => coords);
  const { latitude: lat, longitude: lng } = pos.coords;
     const response = await fetch (`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
     const data = await response.json();
     loader.style.display = 'none'; // Hide the loader when the request is successful
     return(data.address.country)
     
}
const findMe = async function(){
const country = await getCountry();
const data = await fetch(`https://restcountries.com/v3.1/name/${country}`);
const dataJSON = await data.json();
console.log(dataJSON[0])
}
