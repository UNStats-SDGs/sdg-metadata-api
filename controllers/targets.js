var express = require('express'),
  router = express.Router(),
  Targets = require('../models/targets'),
  Indicators = require('../models/indicators');

router.get('/', function (req, res) {
  Targets.getAll(req.query, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res) {
  Targets.getById(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators', function (req, res) {
  Indicators.getAll(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/indicators/:indicator_id', function (req, res) {
  Indicators.getById(req, function (err, response) {
    res.json( response );
  });
});

module.exports = router;