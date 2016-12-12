var utils = require('../utils/utils');

function getIdFromAttributes(data, field) {
  return data.map(function (serie) {
    return serie.attributes[field];
  });
}

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

      data = utils.getAllByIds(ids, 'series');
    } else {
      data = utils.getAll('series');
    }

    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = [];

        if (queryParams.filter && queryParams.filter.id) {
          goal_ids = getIdFromAttributes(data, 'goal_id');

          var goal_uniques = [...new Set(goal_ids)];

          goals = utils.getAllByIds(goal_uniques, 'goals');

        } else {
          goals = utils.getAll('goals');
        }
         
        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        if (queryParams.filter && queryParams.filter.id) {
          target_ids = getIdFromAttributes(data, 'target_id');
          
          var target_uniques = [...new Set(target_ids)];

          targets = utils.getAllByIds(target_uniques, 'targets');

        } else {
          targets = utils.getAll('targets');
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        if (queryParams.filter && queryParams.filter.id) {
          indicator_ids = getIdFromAttributes(data, 'indicator_id');
          
          var indicator_uniques = [...new Set(indicator_ids)];

          indicators = utils.getAllByIds(indicator_uniques, 'indicators');

        } else {
          indicators = utils.getAll('indicators');
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

exports.getAllForIndicator = function (query, next, cb) {
  var out_json = { data: [] },
    queryParams = query.query,
    goal_id = query.params.id,
    target_id = query.params.target_id,
    indicator_id = (query.params.indicator_id) ? query.params.indicator_id : query.params.id,
    data,
    messages = [];

  try {

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = utils.getAllByIds(ids, 'series');
    } else {
      data = utils.getChildren(indicator_id, 'indicator_id', 'series');
    }
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = [];

        if (queryParams.filter && queryParams.filter.id) {
          goal_ids = getIdFromAttributes(data, 'goal_id');

          var goal_uniques = [...new Set(goal_ids)];

          goals = utils.getAllByIds(goal_uniques, 'goals');

        } else {
          goals = utils.getAll('goals');
        }
         
        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        if (queryParams.filter && queryParams.filter.id) {          
          target_ids = getIdFromAttributes(data, 'target_id');
          
          var target_uniques = [...new Set(target_ids)];

          targets = utils.getAllByIds(target_uniques, 'targets');

        } else {
          targets = utils.getAll('targets');
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams && (queryParams.sources === 'true')) {
          sources = true;
        }

        if (queryParams.filter && queryParams.filter.id) {          
          indicator_ids = getIdFromAttributes(data, 'indicator_id');
          
          var indicator_uniques = [...new Set(indicator_ids)];

          indicators = utils.getAllByIds(indicator_uniques, 'indicators', sources);

        } else {
          indicators = utils.getAll('indicators');
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
    series_id = (query.params.series_id) ? query.params.series_id : query.params.id,
    data,
    messages = [];

  try {
    
    data = utils.getAllByIds([series_id], 'series');
    
    out_json.data = data[0];

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goal_ids = getIdFromAttributes(data, 'goal_id');

        var goal_uniques = [...new Set(goal_ids)];

        goals = utils.getAllByIds(goal_uniques, 'goals');

        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        var targets_ids = getIdFromAttributes(data, 'target_id');

        var target_uniques = [...new Set(targets_ids)];

        targets = utils.getAllByIds(target_uniques, 'targets');

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams && (queryParams.sources === 'true')) {
          sources = true;
        }

        var indicator_ids = getIdFromAttributes(data, 'indicator_id');

        var indicator_uniques = [...new Set(indicator_ids)];

        var indicators = utils.getAllByIds(indicator_uniques, 'indicators', sources);

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