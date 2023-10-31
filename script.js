"use strict";
const find = document.getElementById("find"); //Reference to the button
const container = document.getElementById("container"); //Reference to main container
const neighbors = document.getElementById("neighbors"); //Reference to neighbors container
const loader = document.getElementById("loader"); // Reference to the loader element
const loading = document.getElementById("loading"); //Reference to loading text for loader
const neighbors_heading = document.getElementById("neighbors_heading"); //Reference to neighbour heading
const errMsg = document.getElementById("errMsg"); //Reference to thr error message
find.addEventListener("click", function () {
  //button eventlistener to get the data
  loader.style.display = "block"; // Display the loader before making the geolocation request
  loading.style.display = "block"; // Display the loading text before making the geolocation request
  Promise.race([racePromise(), findMe()])
    .then((res) => renderCountry(res)) //passing the data to renderCountry to be displayed on the page
    .catch((err) => {
      //racing the findMe and racePromise for timeout
      const html = `${err} | Request took too long. | Please wait until loading finishes.`; //error message display upon an error or timeout
      errMsg.insertAdjacentText("afterbegin", html); //adding the error message to the page
      console.log(err);
    });
});

const getLoc = function () {
  //function to get the user location coordinates
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
const getCountry = async function () {
  //function to get the country thr user resides currently
  const pos = await getLoc();
  const { latitude: lat, longitude: lng } = pos.coords;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  ); //API call for getting the country
  const data = await response.json();
  loader.style.display = "none"; // Hide the loader when the request is successful
  loading.style.display = "none"; // Hide the loading text when the request is successful
  errMsg.style.display = "none" //Hiding the error message
  return data.address.country;
};
const findMe = async function () {
  //function to get the data of the current country
  return new Promise(async (resolve, reject) => {
    try {
      const country = await getCountry(); //calling the getCountry function to get the country to pass to API for details
      const data = await fetch(`https://restcountries.com/v3.1/name/${country}`); //API call for getting the country's data
      const dataJSON = await data.json(); //resolving the recieved data to JSON format
      resolve(dataJSON[0]); //resolving with the data
    } catch (err) {
      reject(err); //rejecting with the error of catch block
    }
  });
};
const racePromise = function () {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout"));
    }, 5000); //rejecting out in 5 seconds and raising an error response
  });
};

const renderCountry = function (data) {
  const country = `
    <div class="flag_container">
      <div class="name">
        <h3>${data.name.common}</h3>
      </div>
      <div class="flag">
        <img src="${data.flags.png}" alt="Flag" />
      </div>
    </div>
    <div class="info_container">
      <p><span class="sub">Currency: </span>${Object.keys(data.currencies).join(
        ", "
      )}</p>
      <p><span class="sub">Population: </span>${data.population}</p>
      <p><span class="sub">Area (km²): </span>${data.area}</p>
      <p><span class="sub">Languages: </span>${Object.values(
        data.languages
      ).join(", ")}</p>
    </div>`; //the html for country's details

  // container.innerHTML = html;
  container.insertAdjacentHTML("afterbegin", country); //adding the html to the page
  neighboringData(data); //passing the data to the function for neighboring countries processing
  find.style.display = "none"; //removing the find button from the page
};
const neighboringData = async function (data) {
  //function to process the neighbors
  const borders = await data.borders; //await for the borders data
  if (borders.length > 0) {
    //displaying heading if neighbors count is greater than 0
    neighbors_heading.style.display = "block";
  }
  for (const element of borders) {
    //passing the borders or neighboring one by one to API for data
    const data = await fetch(`https://restcountries.com/v3.1/alpha/${element}`); //data being passed to API for response
    const dataJSON = await data.json(); //response to JSON format

    renderNeighbor(dataJSON[0]); //calling the renderNeighbor to display the data on the page
  }
};
const renderNeighbor = function (data) {
  //function to display country's neighbors on the page
  const html = `
  <div class="items">
  <div class="info_container">
    <img src="${data.flags.png}" alt="">
    <h2>${data.name.common}</h2>
    <p><span class="sub">Currency: </span>${Object.keys(data.currencies).join(
      ", "
    )}</p>
    <p><span class="sub">Population: </span>${data.population}</p>
    <p><span class="sub">Area (km²): </span>${data.area}</p>
    <p><span class="sub">Languages: </span>${Object.values(data.languages).join(
      ", "
    )}</p>
  </div>
</div>`; //html for the neighbors data
  neighbors.insertAdjacentHTML("beforeend", html); //adding the data to the page
};
