"use strict";
const find = document.getElementById("find"); //Reference to the button
const container = document.getElementById("container"); //Reference to main container
const loader = document.getElementById("loader"); // Reference to the loader element

find.addEventListener("click", function () { //button eventlistener to get the data
  loader.style.display = "block"; // Display the loader before making the geolocation request
  Promise.race([racePromise(), findMe()]).then(res => console.log(res));
  
});

const getLoc = function () { //function to get the user location coordinates
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    return new Promise((_, reject) =>
      reject("Geolocation is not supported by this browser")
    );
  }
};
const getCountry = async function () { //function to get the country thr user resides currently
  const pos = await getLoc();
  const { latitude: lat, longitude: lng } = pos.coords;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  ); //API call for getting the country
  const data = await response.json();
  loader.style.display = "none"; // Hide the loader when the request is successful
  return data.address.country;
};
const findMe = async function () { //function to get the data of the current country
  return new Promise(async(resolve, reject) => {
    try{
      const country = await getCountry(); //calling the getCountry function to get the country to pass to API for details
      const data = await fetch(`https://restcountries.com/v3.1/name/${country}`); //API call for getting the country's data
      const dataJSON = await data.json();
      resolve(dataJSON[0]);
    }
    catch(err){
      reject(err);
    }
  });
};
const racePromise = function(){
  return new Promise((_, reject) => {
    setTimeout(
      () => {
        reject(new Error("Timeout"));
      },
      5000
    )
  });
}

