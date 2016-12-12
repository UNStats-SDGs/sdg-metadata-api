var express = require('express'),
  router = express.Router(),
  Indicators = require('../models/indicators'),
  Series = require('../models/series');

router.get('/', function (req, res, next) {
  Indicators.getAll(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res, next) {
  Indicators.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/series', function (req, res, next) {
  Series.getAllForIndicator(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/series/:series_id', function (req, res, next) {
  Series.getById(req, next, function (err, response) {
    res.json( response );
  });
});

module.exports = router;