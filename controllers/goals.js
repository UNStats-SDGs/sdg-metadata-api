var express = require('express'),
  router = express.Router(),
  Goals = require('../models/goals'),
  Targets = require('../models/targets'),
  Indicators = require('../models/indicators');

router.get('/', function (req, res) {
  Goals.getAll(req.query, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res) {
  Goals.getById(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets', function (req, res) {
  // Goals.getTargetsByGoalId(req, function (err, response) {
  //   res.json( response );
  // });
  Targets.getAll(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id', function (req, res) {
  // Goals.getTarget(req, function (err, response) {
  //   res.json( response );
  // });
  Targets.getById(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators', function (req, res) {
  // Goals.getIndicatorsForTarget(req, function (err, response) {
  //   res.json( response );
  // });
  Indicators.getAll(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/targets/:target_id/indicators/:indicator_id', function (req, res) {
  // Goals.getIndicator(req, function (err, response) {
  //   res.json( response );
  // });
  Indicators.getById(req, function (err, response) {
    res.json( response );
  });
});

module.exports = router;