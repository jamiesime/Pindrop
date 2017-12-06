var allCountries;

var makeRequest = function(url, callback){
  //Create a new XHR
  var request = new XMLHttpRequest();
  //Open the request, passing in the HTTP request type (GET in this case),
  // and the url
  request.open("GET", url);
  //An event listener for the request having loaded, then call callback function
  request.addEventListener("load", callback);
  //GO!
  request.send();
};

var requestComplete = function(){
  if (this.status !== 200) {return;}

  var jsonString = this.responseText;
  var countries = JSON.parse(jsonString);
  allCountries = countries;
  populateDropdown(countries);
};

var populateDropdown = function(countries){
  var select = document.getElementById('country-dropdown');
  for (country of countries){
    var option = document.createElement('option');
    option.innerText = country.name;
    option.value = country.name;
    select.appendChild(option);
  }
}

var getCountry = function(countryName){
  for (country of allCountries){
    if (country.name === countryName){
      return country;
    }
  }
}

var displayCountryInfo = function(country){
  var name = document.getElementById("country-name");
  var population = document.getElementById("country-population");
  var capital = document.getElementById("country-capital");
  name.innerText = country.name;
  population.innerText = country.population;
  capital.innerText = country.capital;

}

var saveLastSelectedCountry = function(country){
  var jsonString = JSON.stringify(country);
  localStorage.setItem('currentCountry', jsonString);
}



var app = function(){
  var url = "https://restcountries.eu/rest/v2/all";
  makeRequest(url, requestComplete);

  var mapStart = {lat: 55.856998, lng:-4.244088};
  var mapContainer = document.getElementById('main-map');
  var mainMap = new MapWrapper(mapContainer, mapStart, 10);

  var countrySelect = document.getElementById('country-dropdown');
  countrySelect.addEventListener('change', function(){
    country = getCountry(countrySelect.value);
    displayCountryInfo(country);
    saveLastSelectedCountry(country);
    mainMap.recenterMap(country.latlng);
    mainMap.markerAtCurrentCountry(country);
  })

};

window.addEventListener('load', app);
