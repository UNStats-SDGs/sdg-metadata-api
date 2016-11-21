var express = require('express'),
  router = express.Router(),
  Targets = require('../models/targets');

router.get('/', function (req, res) {
  Targets.getAllTargets(req.query, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res) {
  Targets.getById(req, function (err, response) {
    res.json( response );
  });
});

module.exports = router;