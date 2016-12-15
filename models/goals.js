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
      
      data = utils.getAllByIds(ids, 'goals');
    } else {
      data = utils.getAll('goals');
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
              return utils.getChildren(id, 'goal_id', 'targets');
            })
            .reduce(function (a,b) {
              return a.concat(b);
            }, []);

        } else {
          targets = utils.getAll('targets');
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var indicators = [];

        var sources = false;
        if (queryParams.sources && queryParams.sources === 'true') {
          sources = true;
        }

        if (queryParams && queryParams.filter && queryParams.filter.id) {

          var ids = queryParams.filter.id.split(',');
         
          indicators = ids.map(function(id) {
            return utils.getChildren(id, 'goal_id', 'indicators');
          });

        } else {
          indicators = utils.getAll('indicators');
        }

        out_json.included = out_json.included.concat( indicators );
      }

      if (includes.indexOf('series') > -1) {
        var series = [];

        if (queryParams && queryParams.filter && queryParams.filter.id) {

          var ids = queryParams.filter.id.split(',');
         
          series = ids.map(function(id) {
            return utils.getChildren(id, 'goal_id', 'series');
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

exports.getById = function (query, next, cb) {
  var out_json = { data: [] },
    id = query.params.id,
    queryParams = query.query,
    data,
    messages = [];

  try {

    data = utils.getAllByIds([id], 'goals');
       
    out_json.data = data[0];

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('targets') > -1) {
        var targets = utils.getChildren(id, 'goal_id', 'targets');        

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

        var indicators = utils.getChildren(id, 'goal_id', 'indicators', sources);

        if (indicators.length === 0) {
          messages.push('No Indicators found for Goal' + id);
        }

        out_json.included = out_json.included.concat( indicators );
      }

      if (includes.indexOf('series') > -1) {
        var series = utils.getChildren(id, 'goal_id', 'series');
        
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