require('dotenv').config();

var express = require('express'),
  app = express(),
  fs = require('fs'),
  cors = require('cors'),
  port = process.env.PORT || 3000;

if (!process.env.API_ROOT) {
  process.env.API_ROOT = 'http://localhost:3000';
}

app.use( cors() );

app.use( require('./controllers') );

app.use(function (err, req, res, next) {
  console.log(err);
  
  res.json({ errors: [ err ] });
});

app.listen(port, function () {
  
  _GOALS = JSON.parse( fs.readFileSync('data/goals/goals.json') );

  _TARGETS = JSON.parse( fs.readFileSync('data/targets/targets.json') );

  _INDICATORS = JSON.parse( fs.readFileSync('data/indicators/indicators.json') );

  _SERIES = JSON.parse( fs.readFileSync('data/series/series.json') );

  _UNIT_SDG = JSON.parse( fs.readFileSync('data/defaults/UNIT_SDG.json') );

  _UNIT_MULT = JSON.parse( fs.readFileSync('data/defaults/UNIT_MULT.json') );

  _SEX = JSON.parse( fs.readFileSync('data/defaults/SEX.json') );

  _FREQ = JSON.parse( fs.readFileSync('data/defaults/FREQ.json') );

  _AGE_GROUP = JSON.parse( fs.readFileSync('data/defaults/AGE_GROUP.json') );

  _NATURE_SDG = JSON.parse( fs.readFileSync('data/defaults/NATURE_SDG.json') );

  _SOURCE_TYPE_SDG = JSON.parse( fs.readFileSync('data/defaults/SOURCE_TYPE_SDG.json') );

  _LOCATION_TYPE_SDG = JSON.parse( fs.readFileSync('data/defaults/LOCATION_TYPE_SDG.json') );

  _REF_AREA_SDG = JSON.parse( fs.readFileSync('data/defaults/REF_AREA_SDG.json') );

  _DEFAULTS = {
    files: {
      goals: _GOALS,
      targets: _TARGETS,
      indicators: _INDICATORS,
      series: _SERIES,
      series_areas_data_path: 'data/series/areas/REFAREAS-',
      series_ids_data_path: 'data/series/ids/SERIES-',
      geometry_path: 'data/geometry',
    },
    unit_sdg: _UNIT_SDG,
    unit_mult: _UNIT_MULT,
    sex: _SEX,
    freq: _FREQ,
    age_group: _AGE_GROUP,
    nature_sdg: _NATURE_SDG,
    source_type_sdg: _SOURCE_TYPE_SDG,
    location_type_sdg: _LOCATION_TYPE_SDG,
    ref_area_sdg: _REF_AREA_SDG,
    model_type: {
      goals: 'goal',
      targets: 'target',
      indicators: 'indicator',
      series: 'series'
    }
  };
  
  console.log('ready!');
});