// Initialize Firebase
var config = {
  apiKey: "AIzaSyAEgbnDaSU0YcCQ3YR0XkDeJ3IEpKA87OI",
  authDomain: "goout-e23d5.firebaseapp.com",
  databaseURL: "https://goout-e23d5.firebaseio.com",
  projectId: "goout-e23d5",
  storageBucket: "",
  messagingSenderId: "392746248806"
};
firebase.initializeApp(config);
var myLocation = "";
var database = firebase.database();
// API URLS (can move them into functions if desired)
var foursquareUrl =
  "https://api.foursquare.com/v2/venues/search?near=" +
  myLocation +
  "&client_id=4T1KZV0MFURUT2KMWDORDZQL23ULXHEHE1LPUGHFP1PP023O&client_secret=YSZAY3ZWOOEGOHAV31BHFUJGAERZLOAICUTRNEA2FOZQJG0I&v=20180323&limit=10";

$("#location-search").on("click", function(event) {
  console.log("Clicked...");

  event.preventDefault();
  document.getElementById("myBtn").style.display = "block";
  var myLocation = $("#the-real-location")
    .val()
    .trim();

  console.log(myLocation);

  var eventbriteURL =
    "https://www.eventbriteapi.com/v3/events/search/?location.address=" +
    myLocation +
    "&location.within=10mi&expand=external_ticketing,ticket_availability&token=S5ODNTLSPUBRNVOLMPSS";
  var weatherLocation =
    "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=2QSqJXGVZVwwlziV0njAtYbbLZONsCTm&q=" +
    myLocation;
  ajaxCall(eventbriteURL);
  console.log(eventbriteURL);
  getLocationKey(weatherLocation);

  // primary AccuWeather key A9IYPehiyBlSicaf0AMQF9lZsMQMnLnH
  // secondary AccuWeather key 2QSqJXGVZVwwlziV0njAtYbbLZONsCTm
});

function ajaxCall(url) {
  console.log("ajaxCall...");

  $.ajax({
    url: url,
    method: "GET"
  }).then(function(response) {
    console.log("test");
    //after the response comes back use it to set a global variable that
    //can then be used by eventDisplay()
    console.log(response);
    $("#event-display").empty();

    for (var i = 0; i < 12; i++) {
      var t = $("<tr>");
      var eventUrl = response.events[i].url;
      var eventImg = $("<img>")
        .addClass("logo")
        .attr("src", response.events[i].logo.url);
      t.append(eventImg);
      if (response.events[i].is_free === true) {
        t.append("Cost: FREE");
      } else {
        t.append(
          "Cost: " +
            response.events[i].ticket_availability.minimum_ticket_price
              .major_value +
            " - " +
            response.events[i].ticket_availability.maximum_ticket_price.display
        );
      }
      t.append(
        $("<td>").html(
          "<p1><a href= " +
            eventUrl +
            " target='_blank' >" +
            response.events[i].name.text +
            " </a>" +
            response.events[i].summary +
            "</p1><br><br><br>"
        )
      );
      $("#event-display").prepend(t);
    }
  });
}

function getLocationKey(weatherLocation) {
  console.log("ajaxCall2...");
  $.ajax({
    url: weatherLocation,
    method: "GET"
  }).then(function(response2) {
    var results = response2[0].Key;
    //after the response comes back use it to set a global variable that
    //can then be used by eventDisplay()
    console.log(results);
    showCurrentConditions(results);
    showForecast(results);
  });
}

function showCurrentConditions(key) {
  var queryUrl =
    "http://dataservice.accuweather.com/currentconditions/v1/" +
    key +
    "?apikey=2QSqJXGVZVwwlziV0njAtYbbLZONsCTm&details=true";
  console.log(queryUrl);
  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(currentConditions) {
    console.log(currentConditions);
    $("#current-display").html(
      currentConditions[0].Temperature.Imperial.Value +
        currentConditions[0].Temperature.Imperial.Unit +
        " " +
        currentConditions[0].WeatherText
    );
  });
}
function showForecast(key) {
  var queryUrl =
    "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
    key +
    "?apikey=2QSqJXGVZVwwlziV0njAtYbbLZONsCTm&details=true";
  console.log(queryUrl);
  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(forecastConditions) {
    console.log(forecastConditions);
    for (var i = 0; i < 5; i++) {
      $("#temp-display" + i).html(
        "<p>" +
          forecastConditions.DailyForecasts[i].Temperature.Maximum.Value +
          forecastConditions.DailyForecasts[i].Temperature.Maximum.Unit +
          "/" +
          forecastConditions.DailyForecasts[i].Temperature.Minimum.Value +
          forecastConditions.DailyForecasts[i].Temperature.Minimum.Unit +
          "</p>"
      );

      var icon = $("<img>");
      var iconNumber = forecastConditions.DailyForecasts[i].Day.Icon;
      if (iconNumber < 10) {
        iconNumber = "0" + forecastConditions.DailyForecasts[i].Day.Icon;
      }
      let imageUrl =
        "https://developer.accuweather.com/sites/default/files/" +
        iconNumber +
        "-s.png";
      icon.attr("src", imageUrl);

      $("#temp-display" + i).prepend(icon);

      $("#forecasted-display").append();
    }
  });
}
//Initial Values
var name = "";
var email = "";
var message = "";

//Capture Button Click
$("#contact-submit-btn").on("click", function(event) {
  event.preventDefault();
  //Grabbed values from text-boxes
  name = $("#name-input")
    .val()
    .trim();
  email = $("#email-input")
    .val()
    .trim();
  message = $("#message-input")
    .val()
    .trim();

  var newContact = {
    name: name,
    email: email,
    message: message
  };
  //Code for Setting values in database
  database.ref().push(newContact);
  // Firebase watcher + initial loader
  console.log(newContact);
  console.log(newContact.name);
  console.log(newContact.email);
  console.log(newContact.message);

  //Clear text boxes after submit
  $("#name-input").val("");
  $("#email-input").val("");
  $("#message-input").val("");
});

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
