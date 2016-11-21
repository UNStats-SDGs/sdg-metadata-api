var express = require('express'),
  router = express.Router(),
  Goals = require('../models/goals');

router.get('/', function (req, res) {
  Goals.getAllGoals(req.query, function (err, response) {
    res.json( response );
  });
});

router.get('/:id', function (req, res) {
  Goals.getById(req, function (err, response) {
    res.json( response );
  });
});

module.exports = router;