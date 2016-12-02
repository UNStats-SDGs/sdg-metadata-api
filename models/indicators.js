var utils = require('../utils/utils');

exports.getAll = function (query, next, cb) {
  var out_json = { data: [] },
    data,
    queryParams = query.query,
    target,
    messages = [];

  try {
    
    var sources = false;
    if (queryParams && (queryParams.sources === 'true')) {
      sources = true;
    }

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = ids.map(function(id) {
        return utils.getIndicatorById(id, sources);
      });
    } else {
      data = utils.getAllIndicators(sources);
    }

    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = [];

        if (queryParams.filter && queryParams.filter.id) {
          var indicator_ids = queryParams.filter.id.split(',');

          var goal_ids = indicator_ids.map(function (id) { return id.substr(0, id.indexOf('.')); });

          var goal_uniques = [...new Set(goal_ids)];

          goals = goal_uniques.map(function(id) {
            return utils.getGoalById(id);
          });

        } else {
          goals = utils.getAllGoals();
        }
         
        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        var indicator_ids = queryParams.filter.id.split(',');

        var target_ids = indicator_ids.map(function (id) { return id.substr(0, id.lastIndexOf('.')); });

        var target_uniques = [...new Set(target_ids)];

        targets = target_uniques.map(function (id) {
          return utils.getTargetById(id);
        });

        if (targets.length === 0) {
          messages.push('No Targets found for ids ' + target_uniques);
        }

        out_json.included = out_json.included.concat( targets );
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

exports.getAllForTarget = function (query, next, cb) {
  var out_json = { data: [] },
    queryParams = query.query,
    goal_id = query.params.id,
    target_id = query.params.target_id,
    data;

  try {

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = ids.map(function(id) {
        return utils.getIndicatorById(id);
      });
    } else {
      data = utils.getIndicatorsForTarget(target_id);
    }
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = utils.getGoalById(goal_id);       
        out_json.included = out_json.included.concat( [goals] );
      }

      if (includes.indexOf('targets') > -1) {
        var target = utils.getTargetById(target_id);

        if (!target) {
          messages.push('Unable to find Target id ' + target_id);
        }

        out_json.included = out_json.included.concat( [target] );
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
    goal_id = query.params.id,
    target_id = query.params.target_id,
    indicator_id = query.params.indicator_id,
    data,
    messages = [];

  try {
    
    data = utils.getIndicatorById(indicator_id);
    
    out_json.data = [data];

    if (query.query && query.query.include) {
      var includes = query.query.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goal = utils.getGoalById(goal_id);
        out_json.included = out_json.included.concat( [goal] );
      }

      if (includes.indexOf('targets') > -1) {
        var target = utils.getTargetById(target_id);

        if (!target) {
          messages.push('Unable to find Target id ' + target_id);
        }
        
        out_json.included = out_json.included.concat( [target] );
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

exports.getField = function () {
  throw {
    title: 'not implemented',
    status: 501
  }
}