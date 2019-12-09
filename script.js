// Create a variable to hold the map
let myMap;
// Create a variable to hold the canvas
let canvas;
// Create a variable to hold Meteorite Data
let meteorites;
// Create variable to hold Mill Data
let mills;
// Create variable to hold Monument data
let monuments;

// Create a new Mappa instance using Leaflet
const mappa = new Mappa("Leaflet");

// Calculate grid

// Put all of the map options in a single object
const options = {
    // Center of Rhode Island
    lat: 41.718114, //0
    lng: -71.572221, //0
    zoom: 9, //4
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" // Dark map style
}

function setup() {
    canvas = createCanvas(windowWidth/4, windowHeight/2);
    // place canvas in the appropriate grid section
    canvas.parent('map_A');

    // Create a tile map with the options defined above
    myMap = mappa.tileMap(options);
    // Overlay the canvas over the tile map
    myMap.overlay(canvas);
    // Only redraw the map points when the map changes and not every frame
    // myMap.onChange(drawPoint);

    // Load the Data
    meteorites = loadTable('Meteorite_Landings.csv', 'csv', 'header');
    // Load the Data
    mills = loadTable('Mills.csv', 'csv', 'header');
    // Load the Data
    monuments = loadTable('Monuments.csv', 'csv', 'header');
    // Only redraw the meteorites when the map position changes and not every frame
    // myMap.onChange(drawMeteorites);

    // Only redraw the sites when the map position changes and not every frame
    myMap.onChange(drawMills);
    myMap.onChange(drawMonuments);



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
}

function drawMills() {
    // Clear Canvas
    clear();
    // Add a color to our ellipse
    fill(200, 100, 100);

    for (let i=0; i<mills.getRowCount(); i++) {
        // Get the lat/lng of each meteorite
        const latitude = Number(mills.getString(i, 'Latitude'));
        const longitude = Number(mills.getString(i, 'Longitude'));

        /* Only draw the sites if the position is inside the current map bounds. We use a Leaflet method to check if the lat and lng are contained inside the current map. This way we draw just what we are going to see and not everything. See getBounds() in http://lefletjs.com/reference-1.1.0.html */
        if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
            const pos = myMap.latLngToPixel(latitude, longitude);
            // Get the size of the meteorite and map it. 60000000 is the mass of the largest meteorite
            // let size = mills.getString(i, 'mass (g)');
            // size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
            let size = 20;
            ellipse(pos.x, pos.y, size, size);
        }
    }
}

function drawMonuments() {
    // Clear Canvas
    // clear();

    // Add a color to our ellipse
    fill(100, 100, 200);
    for (let i=0; i<monuments.getRowCount(); i++) {
        // Get the lat/lng of each meteorite
        const latitude = Number(monuments.getString(i, 'Latitude'));
        const longitude = Number(monuments.getString(i, 'Longitude'));

        /* Only draw the sites if the position is inside the current map bounds. We use a Leaflet method to check if the lat and lng are contained inside the current map. This way we draw just what we are going to see and not everything. See getBounds() in http://lefletjs.com/reference-1.1.0.html */
        if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
            const pos = myMap.latLngToPixel(latitude, longitude);
            // Get the size of the meteorite and map it. 60000000 is the mass of the largest meteorite
            // let size = mills.getString(i, 'mass (g)');
            // size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
            let size = 20;
            ellipse(pos.x, pos.y, size, size);
        }
    }
}
