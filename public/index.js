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

var getCountryByCode = function(countryCode){
  for (country of allCountries){
    if (country.alpha3Code === countryCode){
      return country;
      debugger;
    }
  }
}

var getBorderingCountries = function(country){
  bordering = [];
  for (border of country.borders){
    bordering.push(border);
  }
  return bordering;
}

var displayCountryInfo = function(country){
  var name = document.getElementById("country-name");
  var population = document.getElementById("country-population");
  var capital = document.getElementById("country-capital");
  name.innerText = country.name;
  population.innerText = country.population;
  capital.innerText = country.capital;

}

var handleBorderBtnClick = function(mainMap, country){
  displayCountryInfo(country);
  saveLastSelectedCountry(country);
  mainMap.recenterMap(country.latlng);
  mainMap.markerAtCurrentCountry(country);
  borders = getBorderingCountries(country);
  displayBorderingCountries(mainMap, borders);
  var countrySelect = document.getElementById('country-dropdown');
  countrySelect.value = country.name;
};

var displayBorderingCountries = function(mainMap, bordering){
  var borderArea = document.getElementById('bordering-list');
  var borderText = document.getElementById('bordering-header');
  while (borderArea.firstChild){
    borderArea.removeChild(borderArea.firstChild);
  }
  if (bordering != undefined && bordering.length > 0){
    borderText.innerText = bordering.length + " bordering countries";
    for (border of bordering) {
      var btn = document.createElement('button');
      btn.innerText = border;
      borderArea.appendChild(btn);
      btn.addEventListener('click', function(){
        var country = getCountryByCode(this.innerText);
        handleBorderBtnClick(mainMap, country);
      });
    };
  }
  else {
    borderText.innerText = "No bordering countries."
  }
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
    borders = getBorderingCountries(country);
    displayBorderingCountries(mainMap, borders);
  })

};

window.addEventListener('load', app);
