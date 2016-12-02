var utils = require('../utils/utils');

exports.getAll = function (query, next, cb) {
  var out_json = { data: [] },
    data,
    queryParams = query.query,
    target,
    messages = [];

  try {
    
    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = ids.map(function(id) {
        return utils.getTargetById(id);
      });
    } else {
      data = utils.getAllTargets();
    }
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = [];

        if (queryParams.filter && queryParams.filter.id) {
          
          var target_ids = queryParams.filter.id.split(',');

          var goal_ids = target_ids.map(function (id) { return id.substr(0, id.indexOf('.')); });
          
          var goal_uniques = [...new Set(goal_ids)];

          goals = goal_uniques.map(function(id) {
            return utils.getGoalById(id);
          });

        } else {
          goals = utils.getAllGoals();
        }

        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('indicators') > -1) {
        var indicators = [],
          msg = '';

        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        if (queryParams.filter && queryParams.filter.id) {

          var target_ids = queryParams.filter.id.split(',');

          indicators = target_ids
            .map(function (id) {
              return utils.getIndicatorsForTarget(id, sources);
            })
            .reduce(function(a, b) {
              return a.concat(b);
            }, []);

          msg = 'No Indicators found for Target Ids ' + target_ids;

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

exports.getAllForGoal = function (query, next, cb) {
  var out_json = { data: [] },
    queryParams = query.query,
    goal_id = query.params.id,
    data,
    messages = [];

  try {
    
    data = utils.getTargetsForGoal(goal_id);
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var targets = utils.getGoalById(goal_id);       
        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        var indicators = utils.getIndicatorsForGoal(goal_id, sources);
        if (indicators.length === 0) {
          messages.push('No Indicators found for Goal ' + goal_id);
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
    queryParams = query.query,
    target_id = (query.params.target_id) ? query.params.target_id : query.params.id,
    data,
    messages = [];

  try {

    data = utils.getTargetById(target_id);
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goal_id = target_id.substr(0, target_id.indexOf('.'));

        var goal = utils.getGoalById(goal_id);
        if (!goal) {
          messages.push('Unable to find Goal for Target Id ' + target_id);
        }

        out_json.included = out_json.included.concat( [goal] );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        var indicators = utils.getIndicatorsForTarget(target_id, sources);

        if (indicators.length === 0) {
          messages.push('No Indicators found for Target Id ' + target_id);
        }

        out_json.included = out_json.included.concat( indicators );
      }
    }

    out_json.meta = utils.buildMetaObject(query, data.length, queryParams, (messages.length > 0) ? messages : null);
  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}