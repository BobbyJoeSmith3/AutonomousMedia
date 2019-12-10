// Create a variable to hold the map
let myMap;
// Create a variable to hold the canvas
let canvas;
// Create a new Mappa instance using Leaflet
const mappa = new Mappa("Leaflet");

// For perlin noise
let t = 0.0;
let u = 1000;

// frameRate
let fr = 1;

// Put all of the map options in a single object
const options = {
    // RISD Design Center
    lat: 41.826439, //0
    lng: -71.408733, //0
    zoom: 15, //4
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" // Dark map style
}

let mediaSites = [
    //fence = new geoFenceCircle(44.979779, -93.325499, 0.05, insideTheFence, outsideTheFence, 'mi')
    {
      mediaID: 'C',
      latitude: 41.826439,
      longitude: -71.408733,
      // pixelLat: myMap.latLngToPixel(this.latitude, this.longitude).x,
      // pixelLong: myMap.latLngToPixel(this.latitude, this.logitude).y,
      fenceRadius: 0.05,
      insideCallback: insideTheFence,
      outsideCallback: outsideTheFence,
      units: 'mi'
      // coordsToPix: function () {
      //     let pixelCoords = myMap.latLngToPixel(this.latitude, this.longitude);
      //     this.pixelLat = pixelCoords.x;
      //     this.pixelLong = pixelCoords.y;
      //     return(pixelCoords);
      // },
      // pixToCoords: function() {
      //     let coords = myMap.pixelToLatLng(this.pixelLat, this.pixelLong);
      //     console.log(coords);
      //     this.latitude = coords.lat;
      //     this.longitude = coords.lng;
      //     return(coords);
      // }
      // checkingGeoFence: false
  },
  {
    loc: 'RISD ID Building',
    mediaID: 'A',
    latitude: 41.8231969,
    longitude: -71.4064552,
    fenceRadius: 0.05,
    insideCallback: insideTheFence,
    outsideCallback: outsideTheFence,
    units: 'mi'
  },
  {
    loc: 'RISD CIT Building',
    mediaID: 'B',
    latitude: 41.8224994,
    longitude: -71.4118984,
    fenceRadius: 0.05,
    insideCallback: insideTheFence,
    outsideCallback: outsideTheFence,
    units: 'mi'
  },
  {
    loc: 'RISD Nature Lab',
    mediaID: 'D',
    latitude: 41.827022,
    longitude: -71.407982,
    fenceRadius: 0.05,
    insideCallback: insideTheFence,
    outsideCallback: outsideTheFence,
    units: 'mi'
  },
]

// Coordinate location of user
let userCoordLoc;

let fence0, fence1, fence2, fence3;

function preload() {
    console.log("calculating user position");
    userCoordLoc = getCurrentPosition();
    console.log("user position found");
}

function setup() {
    // Check for geoLocation availability
    if(geoCheck() == true){
  		//geolocation is available
          console.log("geoLocation enabled");
          // get initial position information of user
          // userCoordLoc = getCurrentPosition();
          // getCurrentPosition(printPosition);
  	}else{
  		//error getting geolocaion
          console.log("something went wrong!");
  	}

    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(fr);
    // Create a tile map with the options defined above
    myMap = mappa.tileMap(options);
    // Overlay the canvas over the tile map
    myMap.overlay(canvas);

    // Create geoFenceCircle
    // fence1 = new geoFenceCircle(mediaSites[0].latitude, mediaSites[0].longitude, mediaSites[0].fenceRadius, mediaSites[0].insideCallback, mediaSites[0].outsideCallback, mediaSites[0].units);

    for (let i = 0; i < mediaSites.length; i++) {
      window['fence' + i] = new geoFenceCircle(mediaSites[i].latitude, mediaSites[i].longitude, mediaSites[i].fenceRadius, mediaSites[i].insideCallback, mediaSites[i].outsideCallback, mediaSites[i].units);
    }

    // Only redraw the sites when the map position changes and not every frame
    myMap.onChange(drawPoint);

    // mediaSites[0].coordsToPix();
    // console.log("Pixel Latitude: " + mediaSites[0].pixelLat);
    // mediaSites[0].pixToCoords();
    // console.log("Coordinate Latitude: " + mediaSites[0].latitude);

}

function draw() {

  movePosition(mediaSites);

}

function drawPoint() {
    // Clear the canvas
    clear();
    // Add a color to our ellipse
    fill(200, 100, 100);
    // for (let g = 0; g < 25; g++) {
    //   let a = random(0, width);
    //   let b = random(0, height);
    //   ellipse(a, b, 20, 20);
    // }

    // Get the canvas position for the latitude and longitude of Providence Rhode Island
    // const providence = myMap.latLngToPixel(41.825995, -71.407743);
    // const providence = myMap.latLngToPixel(mediaSites[0].latitude, mediaSites[0].longitude);
    // // Using that position, draw an ellipse
    // ellipse(providence.x, providence.y, 20, 20);

    // Loop through mediaSites and draw moveable media to screen
    for (let i = 0; i < mediaSites.length; i++) {
      let moveableMedia = myMap.latLngToPixel(mediaSites[i].latitude, mediaSites[i].longitude);
      ellipse(moveableMedia.x, moveableMedia.y, 20, 20);
    }

    // Convert user location to pixels and draw it
    fill(100,100,200);
    let userPixLoc = myMap.latLngToPixel(userCoordLoc.latitude, userCoordLoc.longitude);
    ellipse(userPixLoc.x, userPixLoc.y, 20, 20);

    // Calculate distance to first site
    // var distance = calcGeoDistance(userCoordLoc.latitude, userCoordLoc.longitude, mediaSites[0].latitude, mediaSites[0].longitude);
    // print(`Distance to site ${distance}`);
}

function insideTheFence(position) {
    console.log("You found me!");
}

function outsideTheFence(position) {
    print("You are outside the fence :(")
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

function movePosition(sites) {
    let noiseScale = .00003;
    t = t + 0.005;
    u = u + 0.005;
    // let x = noise(t);
    // let latShift = map(x, 0.0, 1.0, noiseScale * -1, noiseScale);
    // console.log(latShift);
    // sites[0].latitude += latShift;
    // let y = noise(u);
    // let lngShift = map(y, 0.0, 1.0, noiseScale * -1, noiseScale);
    // console.log(lngShift);
    // sites[0].longitude += lngShift;

    // for (let i = 0; i < sites.length; i++) {
    //   let x = noise(t) * random(0,1);
    //   let latShift = map(x, 0.0, 1.0, -1, 1);
    //   console.log(latShift);
    //   sites[i].latitude += latShift;
    //   let y = noise(u) * random(0,1);
    //   let lngShift = map(y, 0.0, 1.0, -1 , 1);
    //   console.log(lngShift);
    //   sites[i].longitude += lngShift;
    // }
    for (let i = 0; i < sites.length; i++) {
      let x = noise(t) * random(0,1);
      let latShift = map(x, 0.0, 1.0, -1, 1);
      let pixPos = myMap.latLngToPixel(sites[i].latitude, sites[i].longitude);
      pixPos.x += latShift;
      let y = noise(u) * random(0,1);
      let lngShift = map(y, 0.0, 1.0, -1 , 1);
      pixPos.y += lngShift;
      let newCoord = myMap.pixelToLatLng(pixPos.x, pixPos.y);
      sites[i].latitude = newCoord.lat;
      sites[i].longitude = newCoord.lng;
    }

    drawPoint();
}

/*
TODO:
 — Make autonomous media smarter
 — Some run from you
 — Some hide/go invisible when you get within a certain Distance
 — Some are drawn to you if you perform some action like singing
 — Some defend themselves by closing the browser tab or scrambling the pixels on the site
 — Media generates and dies
 — Media flocks
 — Some media are stationary plant media which germinate and augment over generations
 — Use different shapes and color for different types of media
 — Make media landscape persistent

*/
