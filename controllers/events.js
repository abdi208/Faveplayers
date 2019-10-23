const express = require('express');
const router = express.Router();
const db = require('../models')
const mbClient = require('@mapbox/mapbox-sdk');
const mbGeocode = require('@mapbox/mapbox-sdk/services/geocoding')
const mb = mbClient({ accessToken: process.env.MAPBOX_KEY })
const geocode = mbGeocode(mb)

router.get('/', function (req, res) {
  res.render('events/search');
});

router.get('/results', function (req, res) {
  geocode.forwardGeocode({
    query: `${req.query.city}, ${req.query.state}`,
    types: ['place'],
    countries: ['us']
  }).send().then(function(response) {
    let results = response.body.features.map(result => {
      return {
        name: result.place_name,
        lat: result.center[1],
        long: result.center[0]
      }
    })
    res.render('events/results', {query: req.query, results});
  })
});

router.post('/add', function(req, res) {
  db.city.findOrCreate({
    where: {
      name: req.body.name
    },
    defaults: {
      lat: req.body.lat,
      long:req.body.long
    }
  })
  .then(function([city, created]) {
    console.log(`${city.name} was ${created ? 'created':'found'}`)
    res.redirect('/favorites')
  })
})


router.get('/favorites', function(req, res) {
    db.city.findAll()
  .then(function(cities) {
    let markers = cities.map(city =>{
      let markerObj = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates" : [city.long, city.lat]
        },
        "properties": {
          "title": city.name,
          "icon": "airport"
        }
      
      }
        return JSON.stringify(markerObj)
    })
    console.log(markers)
    res.render('cities/favorites', {cities, mapkey: process.env.MAPBOX_KEY, markers })

  })
})
module.exports = router;