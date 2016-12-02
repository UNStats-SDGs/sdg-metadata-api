var express = require('express'),
  router = express.Router(),
  Indicators = require('../models/indicators');

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

router.get('/:id/:field', function (req, res, next) {
  Indicators.getField(req, next, function (err, response) {
    res.json( response );
  });
});

module.exports = router;