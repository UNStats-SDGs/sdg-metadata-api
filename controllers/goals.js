var express = require('express'),
  router = express.Router(),
  Goals = require('../models/goals'),
  Targets = require('../models/targets'),
  Indicators = require('../models/indicators'),
  Series = require('../models/series');

router.get('/', function (req, res, next) {
  Goals.getAll(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res, next) {
  Goals.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets', function (req, res, next) {
  Targets.getAllForGoal(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id', function (req, res, next) {
  Targets.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators', function (req, res, next) {
  Indicators.getAllForTarget(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators/:indicator_id', function (req, res, next) {
  Indicators.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators/:indicator_id/series', function (req, res, next) {
  Series.getAllForIndicator(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators/:indicator_id/series/:series_id', function (req, res, next) {
  Series.getById(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators/:indicator_id/series/:series_id/describe', function (req, res, next) {
  Series.describeSeries(req, next, function (err, response) {
    res.json( response );
  });
});

module.exports = router;