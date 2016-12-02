var utils = require('../utils/utils');

exports.getAll = function (query, next, cb) {
  var out_json = { data: [] },
    data,
    queryParams = query.query,
    goal;

  try {
    
    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = ids.map(function (id) {
        return utils.getGoalById(id);
      });

    } else {
      data = utils.getAllGoals();
    }

    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('targets') > -1) {
        var targets = [];

        if (queryParams && queryParams.filter && queryParams.filter.id) {
          
          var ids = queryParams.filter.id.split(',');
          
          targets = ids
            .map(function (id) {
              return utils.getTargetsForGoal(id);
            })
            .reduce(function(a, b) {
              return a.concat(b);
            }, []);

        } else {
          targets = utils.getAllTargets();
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var indicators = [];

        if (queryParams && queryParams.filter && queryParams.filter.id) {

          var ids = queryParams.filter.id.split(',');
          
          indicators = ids
            .map(function (id) {
              return utils.getIndicatorsForGoal(id);
            })
            .reduce(function(a, b) {
              return a.concat(b);
            }, []);

        } else {
          indicators = utils.getAllIndicators();
        }

        out_json.included = out_json.included.concat( indicators );
      }
    }

    out_json.meta = utils.buildMetaObject(query, data.length, queryParams);
    
  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}

exports.getById = function (query, next, cb) {
  var out_json = { data: [] },
    id = query.params.id,
    queryParams = query.query,
    data;

  try {

    data = utils.getGoalById(id);
       
    out_json.data = [ data ];

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('targets') > -1) {
        var targets = utils.getTargetsForGoal(id);        
        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var indicators = utils.getIndicatorsForGoal(id);
        out_json.included = out_json.included.concat( indicators );
      }

    }

    out_json.meta = utils.buildMetaObject(query, 1, queryParams);

  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}