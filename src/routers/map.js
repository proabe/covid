const express = require('express');
const router =  new express.Router();
const vrdlsGeoJSON = require('../app_data/vrdls').get("vrdls");
const {getIndiaData, getStateGeometry, getHelpline} = require('../models/covid19IndiaModel');

router.get('/india/vrdls', (req, res) => {
    res.render('vrdls', {
        title: 'List Of Viral Research and Diagnostic Laboratories In India For Covid-19'
    });
});

router.get('/india', (req, res) => {
    res.render('india', {
        title: 'Indian Gradient According To COVID-19 Data'
    });
});

router.get('/covid/api/india/vrdls/geojson', (req, res) => {
    res.status(200).send(vrdlsGeoJSON);
})

router.get('/covid/api/india/covidData',async (req, res) => {
    try{
        const data = await getIndiaData(req.query.geojson?true:false, req.query.sortBy?req.query.sortBy:false);
        res.status(data.statusCode).send(data);
    }catch(e){
        // res.status(e.statusCode).send(e);
        res.send(e);
    }
})

router.get('/covid/api/india/state/:stateName/geoJSON', (req, res) =>{
    try{
        const geom = getStateGeometry(req.params.stateName);
        if (geom) {
            return res.status(200).send({statusCode: 200, status: "OK", geom})
        }
        return res.status(500).send({statusCode: 500, status: "No geometry"});
    }catch(e){
        return res.status(500).send({statusCode: 500, status: "Server error"})
    }
});

router.get('/covid/api/india/helpline', (req, res) =>{
    try{
        return res.status(200).send({statusCode: 200, status: "OK", helpline: getHelpline()});
    }catch(e){
        return res.status(500).send({statusCode: 500, status: "Server error"})
    }
});

module.exports = router;