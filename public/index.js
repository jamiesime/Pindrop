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

var app = function(){
  var url = "https://restcountries.eu/rest/v2/all";
  makeRequest(url, requestComplete);

  var allBtn = document.getElementById('list-countries-btn');
  allBtn.addEventListener('click', function(){
    allBtn.disabled = "disabled";
  })

};

window.addEventListener('load', app);
