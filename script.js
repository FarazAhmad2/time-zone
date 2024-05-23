document.addEventListener("DOMContentLoaded", () => {
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, (error) => {
        console.log("User denied the location access", error);
        document.querySelector("#wrapper-1 .container").style.display = "none";
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    console.log("Latitude: " + lat);
    console.log("Longitude: " + lon);
    var requestOptions = {
      method: "GET",
    };

    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=5172b2eabaae408b94d5b0b2ee056bde`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        populateData(data, "wrapper-1");
      })
      .catch((error) => console.log("error", error));
  }

  function populateData(data, wrapper) {
    let res = data.features[0].properties;
    const ul = document.querySelector(`#${wrapper} .container`);
    ul.innerHTML = `
            <li>Name Of Time Zone: ${res.timezone.name}</li>
            <li class="coords"><span class="lat">Lat: ${res.lat}</span> <span class="long">Long: ${res.lon}</span></li>
            <li>Offset STD: ${res.timezone.offset_STD}</li>
            <li>Offset STD Seconds: ${res.timezone.offset_STD_seconds}</li>
            <li>Offset DST: ${res.timezone.offset_DST}</li>
            <li>Offset DST Seconds: ${res.timezone.offset_DST_seconds}</li>
            <li>Country: ${res.country}</li>
            <li>Postcode: ${res.postcode}</li>
            <li>City: ${res.city}</li>
  `;
  }

  function showError(message) {
    document.querySelector(".result").style.display = "none";
    document.querySelector("#wrapper-2 .container").style.display = "none";
    const errMsg = document.querySelector(".error");
    errMsg.textContent = message;
    errMsg.style.display = "block";
  }

  getLocation();

  const getLoc = document.getElementById("submit");

  getLoc.addEventListener("click", () => {

    const address = document.getElementById("address").value;
    const errMsg = document.querySelector(".error");

    if (address.trim() == "") {
      showError("Please enter an address!");
      return;
    }

    errMsg.style.display = "none";

    fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        address
      )}&apiKey=5172b2eabaae408b94d5b0b2ee056bde`
    )
      .then((resp) => resp.json())
      .then((geocodingResult) => {
        console.log(geocodingResult);
        populateData(geocodingResult, "wrapper-2");
        document.querySelector(".result").style.display = "block";
        document.querySelector("#wrapper-2 .container").style.display = "block";
      })
      .catch((error) => {
        showError("Timezone could not be found!");
        console.error("error", error);
      });
  });
});
