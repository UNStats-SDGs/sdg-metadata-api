var express = require('express'),
  app = express(),
  fs = require('fs'),
  cors = require('cors'),
  port = process.env.PORT || 3000;

app.use(cors());

app.use( require('./controllers') );

app.listen(port, function () {
  
  _GOALS = JSON.parse( fs.readFileSync('data/goals.json') );

  _TARGETS = JSON.parse( fs.readFileSync('data/targets.json') );

  _INDICATORS = JSON.parse( fs.readFileSync('data/indicators.json') );

  _SERIES = JSON.parse( fs.readFileSync('data/series.json') );

  _DEFAULTS = {
    files: {
      goals: _GOALS,
      targets: _TARGETS,
      indicators: _INDICATORS,
      series: _SERIES
    },
    model_type: {
      goals: 'goal',
      targets: 'target',
      indicators: 'indicator',
      series: 'series'
    },
    attributes: {
      goals: {
        title: null,
        description: null,
        color_info: null
      },
      targets: {
        description: null,
        goal_id: null
      },
      indicators: {
        target_id: null,
        goal_id: null
      }
    }
  };
  
  console.log('ready!');
});