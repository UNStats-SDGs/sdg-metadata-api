var utils = require('../utils/utils');

exports.getAll = function (query, next, cb) {
  var out_json = { data: [] },
    data,
    queryParams = query.query,
    goal,
    messages = [];

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

          msg = 'No Targets found for Goal ids' + ids;

        } else {
          targets = utils.getAllTargets();
          msg = 'No Targets Found';
        }

        if (targets.length === 0) {
          messages.push(msg);
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var indicators = [],
          msg = '';

        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        if (queryParams && queryParams.filter && queryParams.filter.id) {

          var ids = queryParams.filter.id.split(',');
          
          indicators = ids
            .map(function (id) {
              return utils.getIndicatorsForGoal(id, sources);
            })
            .reduce(function(a, b) {
              return a.concat(b);
            }, []);

          msg = 'No Indicators found for Goals ' + ids;

        } else {
          indicators = utils.getAllIndicators(sources);
          msg = 'No Indicators found';
        }

        if (indicators.length === 0) {
          messages.push(msg);
        }

        out_json.included = out_json.included.concat( indicators );
      }
    }

    out_json.meta = utils.buildMetaObject(query, data.length, queryParams, messages.length > 0 ? messages : null);
    
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
    data,
    messages = [];

  try {

    data = utils.getGoalById(id);
       
    out_json.data = [ data ];

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('targets') > -1) {
        var targets = utils.getTargetsForGoal(id);        

        if (targets.length === 0) {
          messages.push('No Targets found for Goal' + id);
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        var indicators = utils.getIndicatorsForGoal(id, sources);

        if (indicators.length === 0) {
          messages.push('No Indicators found for Goal' + id);
        }

        out_json.included = out_json.included.concat( indicators );
      }

    }

    out_json.meta = utils.buildMetaObject(query, 1, queryParams, messages.length > 0 ? messages : null);

  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}