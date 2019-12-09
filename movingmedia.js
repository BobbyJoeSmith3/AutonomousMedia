// Create a variable to hold the map
let myMap;
// Create a variable to hold the canvas
let canvas;
// Create a new Mappa instance using Leaflet
const mappa = new Mappa("Leaflet");

// Put all of the map options in a single object
const options = {
    // RISD Design Center
    lat: 41.826439, //0
    lng: -71.408733, //0
    zoom: 15, //4
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" // Dark map style
}

var userLocation;


function setup() {
    // Check for geoLocation availability
    if(geoCheck() == true){
		//geolocation is available
        console.log("geoLocation enabled");
        // get initial position information of user
        userLocation = getCurrentPosition();
        // getCurrentPosition(printPosition);
	}else{
		//error getting geolocaion
        console.log("something went wrong!");
	}

    canvas = createCanvas(600, 600);

    // Create a tile map with the options defined above
    myMap = mappa.tileMap(options);
    // Overlay the canvas over the tile map
    myMap.overlay(canvas);

    // Only redraw the sites when the map position changes and not every frame
    myMap.onChange(drawPoint);

}

function draw() {}

function drawPoint() {
    // Clear the canvas
    clear();
    // Add a color to our ellipse
    fill(200, 100, 100);

    // Get the canvas position for the latitude and longitude of Providence Rhode Island
    const providence = myMap.latLngToPixel(41.825995, -71.407743);
    // Using that position, draw an ellipse
    ellipse(providence.x, providence.y, 20, 20);

    // Convert user location to pixels and draw it
    fill(100,100,200);
    const userLoc = myMap.latLngToPixel(userLocation.latitude, userLocation.longitude);
    ellipse(userLoc.x, userLoc.y, 20, 20);
}

function printPosition(position) {
    // Print location data of object
    print(position.latitude);
    print(position.longitude);
    print(position.accuracy);
    print(position.altitude);
    print(position.altitudeAccuracy);
    print(position.heading);
    print(position.speed);
}
