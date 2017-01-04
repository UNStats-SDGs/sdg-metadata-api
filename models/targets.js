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

      data = utils.getAllByIds(ids, 'targets');

    } else {
      data = utils.getAll('targets');
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

          goals = utils.getAllByIds(goal_uniques, 'goals');

        } else {
          goals = utils.getAllGoals();
        }

        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('indicators') > -1) {
        var indicators = [];

        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        if (queryParams.filter && queryParams.filter.id) {

          var target_ids = queryParams.filter.id.split(',');
          console.log('target_ids', target_ids);
          indicators = target_ids
            .map(function (id) {
              return utils.getChildren(id, 'target_id', 'indicators', sources);
            })
            .reduce(function(a, b) {
              return a.concat(b);
            }, []);

        } else {
          indicators = utils.getAll('indicators', sources);
        }

        out_json.included = out_json.included.concat( indicators );
      }

      if (includes.indexOf('series') > -1) {
        var series = [];

        if (queryParams.filter && queryParams.filter.id) {

          var target_ids = queryParams.filter.id.split(',');

          series = target_ids
            .map(function (id) {
              return utils.getChildren(id, 'target_id', 'series', sources);
            })
            .reduce(function(a, b) {
              return a.concat(b);
            }, []);

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

exports.getAllForGoal = function (query, next, cb) {
  var out_json = { data: [] },
    queryParams = query.query,
    goal_id = query.params.id,
    data,
    messages = [];

  try {
    
    data = utils.getChildren(goal_id, 'goal_id', 'targets');
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var targets = utils.getAllByIds([goal_id], 'goals');

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        var indicators = utils.getChildren(goal_id, 'goal_id', 'indicators', sources);

        out_json.included = out_json.included.concat( indicators );
      }

      if (includes.indexOf('series') > -1) {

        var series = utils.getChildren(goal_id, 'goal_id', 'series');

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
    target_id = (query.params.target_id) ? query.params.target_id : query.params.id,
    data,
    messages = [];

  try {

    data = utils.getAllByIds([target_id], 'targets');
    
    out_json.data = data[0];

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goal_id = target_id.substr(0, target_id.indexOf('.'));

        var goal = utils.getAllByIds([goal_id], 'goals');

        out_json.included = out_json.included.concat( goal );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        var indicators = utils.getChildren(target_id, 'target_id', 'indicators', sources);
        
        out_json.included = out_json.included.concat( indicators );
      }

      if (includes.indexOf('series') > -1) {
        var series = utils.getChildren(target_id, 'target_id', 'series', sources);
        
        out_json.included = out_json.included.concat( series );
      }
    }

    out_json.meta = utils.buildMetaObject(query, 1, queryParams, (messages.length > 0) ? messages : null);
  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}