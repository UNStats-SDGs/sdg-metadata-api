var express = require('express'),
  router = express.Router();

router.get('/', function (req, res, next) {
  try {
    
    var root = process.env.API_ROOT;

    res.json({ 
      goals: {
        collection: root + '/goals?{include,filter}',
        object: root + '/goals/{:id}?{include}'
      },
      targets: {
        collection: root + '/targets?{include,filter}',
        object: root + '/targets/{:id}?{include}'
      },
      indicators: {
        collection: root + '/indicators?{include,filter}',
        object: root + '/indicators/{:id}?{include}'
      },
      series: {
        collection: root + '/series?{include,filter}',
        object: root + '/series/{:id}?{include}'
      },
      params: {
        include: 'related resources to include in search results',
        filter: 'a filter applied to search results'
      }
    });

  }
  catch (ex) {

    var err = { 
      title: 'error getting API root description', 
      status: 500, 
      detail: 'error getting API root description' 
    };

    next(err);
  }

});

router.use('/goals', require('./goals'));
router.use('/targets', require('./targets'));
router.use('/indicators', require('./indicators'));
router.use('/series', require('./series'));

module.exports = router;