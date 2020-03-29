const cheerio = require("cheerio");
const axios = require("axios");
const geoJSON = require("../app_data/state_geoJSON").get("gJ");
const helpline = require("../app_data/helpline").get("helpline");
const interpolate = require("color-interpolate");
let colormap = interpolate(["#fcd703", "#fc0303"]);

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const getIndiaData = async (geojsonStatus,sortBy) => {
  try {
    const response = await axios.get("https://www.mohfw.gov.in/");
    const $ = cheerio.load(response.data);
    const buttonElem = $('button[class="collapsible"]');
    var dataJSON = [];
    var dataGeoJSON = {
      "type": "FeatureCollection",
      "features":[]
    }
    if (
      buttonElem &&
      buttonElem
        .text()
        .trim()
        .toLowerCase() === "CLICK TO SEE COVID19 STATEWISE STATUS".toLowerCase()
    ) {
      const tableTrElem = $(
        'div[class="content newtab"] > div[class="table-responsive"] > table > tbody > tr'
      );
      let looper = tableTrElem.length - 1;
      let lastRowChildren = $(tableTrElem[looper]).children().length;
      if (lastRowChildren !== 5) {
        looper = looper - 1;
      }
      let totalCases = parseInt(
        $($(tableTrElem[looper]).children()[1]).text().replace( /[^\d.]/g, '' )
      );
      
      for (let index = 0; index < looper; index++) {
        let tr = tableTrElem[index];
        let tds = $(tr).children();
        let perCentIndians = round((parseInt($(tds[2]).text()) / totalCases),2);
        
        let states_ut = $(tds[1]).text();
        let ti = parseInt($(tds[2]).text());
        let tf = parseInt($(tds[3]).text());
        let tcc = ti + tf;
        let cdm = parseInt($(tds[4]).text());
        let death = parseInt($(tds[5]).text());

        
        let dataObj = {
          "State/UT": states_ut,
          "Total Confirmed cases (Indian National)": ti,
          "Total Confirmed cases ( Foreign National )": tf,
          "Total Cummulative Confirmed cases": tcc,
          "Cured/Discharged/Migrated": cdm,
          "Death": death
        };

        dataJSON.push(dataObj);
      }
      if (sortBy) {
        dataJSON = sortingObjects(dataJSON,sortBy,true);
      }
      if (geojsonStatus) {
        dataJSON.forEach((singleFeature) => {
          let feat = getStateGeometry(singleFeature["State/UT"]);
          let insFeat = {"type": "Feature", "properties": singleFeature, geometry: feat.geometry};
          dataGeoJSON.features.push(insFeat);
        })
      }

      const icountElems = $('span[class="icount"]');

      if (icountElems) {
        var cummulativeData = {
          "Passengers screened at airport": parseInt(
            $(icountElems[0])
              .text()
              .replace(/[,]+/g, "")
          ),
          "Active COVID 2019 cases *": parseInt($(icountElems[1]).text()),
          "Cured/discharged cases": parseInt($(icountElems[2]).text()),
          "Death cases": parseInt($(icountElems[3]).text()),
          "Migrated COVID-19 Patient": parseInt($(icountElems[4]).text())
        };
      }

      if(geojsonStatus){
        return {
          data: dataGeoJSON,
          statusCode: 200,
          cummulativeData: cummulativeData?cummulativeData:false
        };  
      }
      return {
        data: dataJSON,
        statusCode: 200,
        cummulativeData: cummulativeData?cummulativeData:false
      };
    }
    throw new Error();
  } catch (e) {
    /* console.log(e); */
    return {
      error: `Something went wrong[Error:(${e.message})]`,
      statusCode: 500
    };
  }
};

const getStateGeometry = name => {
  const geom = geoJSON.features.filter(feature => {
    return (
      feature.properties.state_ut.toLowerCase().trim() ===
      name.toLowerCase().trim()
    );
  });

  if (geom) {
    return geom[0];
  }
  return false;
};

const sortingObjects = (arr,sortBy, reverse=false) => {
  if (sortBy.toLowerCase().trim() !== "state/ut") {
    arr.sort(function(a, b){
        if (reverse) {
          return b[sortBy]-a[sortBy];
        }
        return a[sortBy]-b[sortBy];
    })
  }
  return arr;
}

const getHelpline = () => {
  return helpline;
};

module.exports = {
  getIndiaData,
  getStateGeometry,
  getHelpline
};
