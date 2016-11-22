var express = require('express'),
  router = express.Router(),
  Series = require('../models/series');

router.get('/', function (req, res) {
  Series.getAll(req.query, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res) {
  Series.getById(req, function (err, response) {
    res.json( response );
  });
});

module.exports = router;