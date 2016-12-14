var utils = require('../utils/utils');

exports.getAll = function (query, next, cb) {
  var out_json = { data: [] },
    data,
    queryParams = query.query,
    target,
    sources = false,
    messages = [];

  try {
    
    if (queryParams && (queryParams.sources === 'true')) {
      sources = true;
    }

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = utils.getAllByIds(ids, 'indicators', sources);
    } else {
      data = utils.getAll('indicators', sources);
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

          goals = utils.getAllByIds(goal_uniques, 'goals');

        } else {
          goals = utils.getAllGoals();
        }
         
        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        var targets = [];

        if (queryParams.filter && queryParams.filter.id) {
          var indicator_ids = queryParams.filter.id.split(',');

          var target_ids = indicator_ids.map(function (id) { return id.substr(0, id.lastIndexOf('.')); });

          var target_uniques = [...new Set(target_ids)];

          targets = utils.getAllByIds(target_uniques, 'targets');

        } else {
          targets = utils.getAll('targets');
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('series') > -1) {
        var series = [];

        if (queryParams.filter && queryParams.filter.id) {
          var indicator_ids = queryParams.filter.id.split(',');

          series = indicator_ids
            .map(function (id) { 
              return utils.getChildren(id, 'indicator_id', 'series');
            })
            .reduce(function(a, b) {
              return a.concat(b);
            });
          
        } else {
          series = utils.getAll('series');
        }

        out_json.included = out_json.included.concat( series );
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
    target_id = (query.params.target_id) ? query.params.target_id : query.params.id,
    data,
    messages = [];

  try {
    var sources = false;
    if (queryParams && (queryParams.sources === 'true')) {
      sources = true;
    }

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = utils.getAllByIds(ids, 'indicators', sources);
    } else {
      data = utils.getChildren(target_id, 'target_id', 'indicators', sources);
    }
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = utils.getAllByIds([goal_id], 'goals');

        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        var targets = utils.getAllByIds([target_id], 'targets');

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('series') > -1) {
        var series = utils.getChildren(target_id, 'target_id', 'series');

        out_json.included = out_json.included.concat( series );
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
    indicator_id = (query.params.indicator_id) ? query.params.indicator_id : query.params.id,
    data,
    sources = false,
    messages = [];

  try {

    if (queryParams && (queryParams.sources === 'true')) {
      sources = true;
    }

    data = utils.getAllByIds([indicator_id], 'indicators', sources);
    
    out_json.data = data[0];

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goal_id = indicator_id.substr(0, indicator_id.indexOf('.'));
        
        var goals = utils.getAllByIds([goal_id], 'goals');

        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        var target_id = indicator_id.substr(0, indicator_id.lastIndexOf('.'));

        var targets = utils.getAllByIds([target_id], 'targets');

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('series') > -1) {        
        var series = utils.getChildren(indicator_id, 'indicator_id', 'series');

        out_json.included = out_json.included.concat( series );
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