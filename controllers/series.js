var express = require('express'),
  router = express.Router(),
  Series = require('../models/series');

router.get('/', function (req, res, next) {
  Series.getAll(req, next, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res, next) {
  Series.getById(req, next, function (err, response) {
    res.json( response );
  });
});

module.exports = router;