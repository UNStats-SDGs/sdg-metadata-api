var express = require('express'),
  router = express.Router(),
  Targets = require('../models/targets'),
  Indicators = require('../models/indicators'),
  Series = require('../models/series');

router.get('/', function (req, res, next) {
  Targets.getAll(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res, next) {
  Targets.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators', function (req, res, next) {
  Indicators.getAllForTarget(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators/:indicator_id', function (req, res, next) {
  Indicators.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators/:indicator_id/series', function (req, res, next) {
  Series.getAllForIndicator(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators/:indicator_id/series/:series_id', function (req, res, next) {
  Series.getById(req, next, function (err, response) {
    res.json( response );
  });
});

module.exports = router;