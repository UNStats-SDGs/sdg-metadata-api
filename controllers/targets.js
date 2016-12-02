var express = require('express'),
  router = express.Router(),
  Targets = require('../models/targets'),
  Indicators = require('../models/indicators');

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
  Indicators.getAll(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators/:indicator_id', function (req, res, next) {
  Indicators.getById(req, next, function (err, response) {
    res.json( response );
  });
});

module.exports = router;