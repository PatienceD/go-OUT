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
var myLocation = ""
var database = firebase.database();
// API URLS (can move them into functions if desired)
var foursquareUrl =
  "https://api.foursquare.com/v2/venues/search?near=" +
  myLocation +
  "&client_id=4T1KZV0MFURUT2KMWDORDZQL23ULXHEHE1LPUGHFP1PP023O&client_secret=YSZAY3ZWOOEGOHAV31BHFUJGAERZLOAICUTRNEA2FOZQJG0I&v=20180323&limit=10";
var currentConditionsUrl =
  "http://dataservice.accuweather.com/currentconditions/v1" +
  myLocation +
  "A9IYPehiyBlSicaf0AMQF9lZsMQMnLnH";
var forecastConditionsUrl =
  "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
  myLocation +
  "A9IYPehiyBlSicaf0AMQF9lZsMQMnLnH";

$("#location-search").on("click", function (event) {
  console.log("Clicked...");

  event.preventDefault();

  var myLocation = $("#the-real-location").val().trim();

  console.log(myLocation);

  var eventbriteURL = "https://www.eventbriteapi.com/v3/events/search/?location.address=" + myLocation +
    "&location.within=10mi&token=S5ODNTLSPUBRNVOLMPSS";

  ajaxCall(eventbriteURL);
  console.log(eventbriteURL);

});

function ajaxCall(url) {
  console.log("ajaxCall...");

  $.ajax({
    url: url,
    method: "GET"
  }).then(function (response) {
    console.log("test");
    //after the response comes back use it to set a global variable that 
    //can then be used by eventDisplay()
    console.log(response);
    $("#event-display").empty();
    for (var i = 0; i < 3; i++) {
    var t = $("<tr>");
    var eventImg = $("<img>").addClass("logo").attr("src", response.events[i].logo.url);
    t.append(eventImg);
    t.append($("<td>").text(response.events[i].summary));
    $("#event-display").prepend(t);
    };
  });

}

