var express = require('express'),
  router = express.Router();

router.get('/', function (req, res) {
  res.json( { 'meta' : 'info about the api goes here' } );
});

router.use('/goals', require('./goals'));
router.use('/targets', require('./targets'));
router.use('/indicators', require('./indicators'));
router.use('/series', require('./series'));

module.exports = router;