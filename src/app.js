const express = require('express');
const mapRouter = require('./routers/map');
const hbs = require('hbs');
const path = require('path');
const app = express();

// define paths for express config
const publicDirectoryAddress = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setting handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// serves up static content for express server
app.use(express.static(publicDirectoryAddress));

// going to automatically parse incoming json to an object
app.use(express.json());

app.use(mapRouter);

module.exports = app;
