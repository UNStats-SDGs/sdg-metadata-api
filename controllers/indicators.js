var express = require('express'),
  router = express.Router(),
  Indicators = require('../models/indicators');

router.get('/', function (req, res) {
  Indicators.getAll(req.query, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res) {
  Indicators.getById(req, function (err, response) {
    res.json( response );
  });
});

router.get('/:id/:field', function (req, res) {
  Indicators.getField(req, function (err, response) {
    res.json( response );
  });
});

module.exports = router;