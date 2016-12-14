var express = require('express'),
  router = express.Router();

router.get('/api/v1', function (req, res, next) {
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

router.use('/api/v1/goals', require('./goals'));
router.use('/api/v1/targets', require('./targets'));
router.use('/api/v1/indicators', require('./indicators'));
router.use('/api/v1/series', require('./series'));

module.exports = router;