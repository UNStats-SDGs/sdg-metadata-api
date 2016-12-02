// swiped the Obj -> Array from here: https://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array

function getSeries(id) {
  var seriesFile = _DEFAULTS.files['series']['series'];
  
  return Object.keys(seriesFile)
    .reduce(function (acc, value) {
      var sObj = seriesFile[value];
      if (sObj.indicator_id === id) {
        acc.push({
          id: value,
          description: sObj.description,
          isOfficial: sObj.isOfficial,
          show: sObj.show
        });
      }
      return acc;
    }, []);
}

exports.getAll = function (type) {
  
  var file = _DEFAULTS.files[type][type],
    obj,
    item,
    data,
    retObj = { data: {} };

  data = Object.keys(file)
    .map(function (value) { 
    
      obj = file[value];

      item = {
        id: value,
        type: _DEFAULTS.model_type[type],
        attributes: obj
      };

      if (type === 'indicators') {
        item.attributes.series = getSeries(value);
      }

      return item;

    });

  retObj.data = data;

  return retObj;
}

exports.getAllByIds = function (ids, type, filter) {
  var file = _DEFAULTS.files[type][type],
    obj,
    item,
    data,
    retObj = { data: {} };

  data = ids
    .reduce(function (acc, id) {
      
      obj = file[id];
      
      if (obj) {
        
        delete obj.id;

        item = {
          id: id,
          type: _DEFAULTS.model_type[type],
          attributes: obj
        };

        if (type === 'indicators') {
          item.attributes.series = getSeries(id);
        }

        acc.push(item);
      } else {
        if (!retObj.messages) {
          retObj.messages = [];
        }

        if (type === 'goals') {
          var msg = 'unable to find goal: ' + id;
          if (parseInt(id) < 1 || parseInt(id) > 17) {
            msg += '. please enter a goal number between 1 and 17';
          }
          retObj.messages.push(msg);
        } else if (type === 'targets') {
          retObj.messages.push('unable to find target: ' + id);
        } else if (type === 'indicators') {
          retObj.messages.push('unable to find indicator: ' + id);
        }
      } 
      
      return acc;

    },[]); 

    retObj.data = data;

    return retObj;
}

exports.getChildren = function (parentId, parentField, outType, filter) {
  var file = _DEFAULTS.files[outType][outType],
    obj,
    item,
    data,
    retObj = { data: {} };

  data = Object.keys(file)
    .reduce(function (acc, id) { 
      
      obj = file[id];

      if (obj && (parentId === obj[parentField]) ) {
        
        delete obj.id;

        item = {
          id: id,
          type: _DEFAULTS.model_type[outType],
          attributes: obj
        };

        if (outType === 'indicators') {
          item.attributes.series = getSeries(id);
        }

        acc.push(item);
      }
      return acc;

    }, []);

  retObj.data = data;

  return retObj;
}


/** ---  **/

/** Goals **/
exports.getAllGoals = function () {
  var file = _DEFAULTS.files['goals']['goals'],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
    
      obj = file[id];

      if (obj) {
        item = {
          id: id,
          type: 'goal',
          attributes: obj
        };

        acc.push(item);

      } else {
        throw {
          status: 404,
          detail: 'error attempting to get Goal with id: ' + id,
          title: 'Error getting all Goals'
        }
      }

      return acc;
    }, []);

  return data;
}

exports.getGoalById = function (id) {
  var file = _DEFAULTS.files['goals']['goals'],
    obj,
    item;
    
  obj = file[id];
    
  if (obj) {
    
    delete obj.id;

    item = {
      id: id,
      type: 'goal',
      attributes: obj
    };

  } else {
    var msg = 'Unable to find goal: ' + id;

    if (parseInt(id) < 1 || parseInt(id) > 17) {
      msg += '. Only values between 1 and 17 are supported.';
    }

    throw {
      status: 404,
      detail: msg,
      title: 'Error getting Goal by id'
    }
  }

  return item;
}

/** Targets **/
exports.getAllTargets = function () {
  var file = _DEFAULTS.files['targets']['targets'],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
    
      obj = file[id];

      if (obj) {
        item = {
          id: id,
          type: 'target',
          attributes: obj
        };

        acc.push(item);
      } else {
        throw {
          status: 404,
          detail: 'error attempting to get Target with id: ' + id,
          title: 'Error getting all Targets'
        }
      }

      return acc;

    }, []);

  return data;
}

exports.getTargetById = function (id) {
  var file = _DEFAULTS.files['targets']['targets'],
    obj,
    item;
      
  obj = file[id];
    
  if (obj) {
    
    delete obj.id;

    item = {
      id: id,
      type: 'target',
      attributes: obj
    };

  } else {
    throw {
      status: 404,
      detail: 'Unable to find target: ' + id,
      title: 'Error getting Target by id'
    }
  }

  return item;
}

exports.getTargetsForGoal = function (goal_id) {
  var file = _DEFAULTS.files['targets']['targets'],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
      
      obj = file[id];

      if (obj) {

        if (goal_id === obj['goal_id']) {
          delete obj.id;

          item = {
            id: id,
            type: 'target',
            attributes: obj
          };

          acc.push(item);

        }
        
      } else {
        throw {
          status: 404,
          detail: 'Unable to find Target for Goal ' + goal_id,
          title: 'Error getting Targets for Goal'
        }
      }
      return acc;

    }, []);

  return data;
}

/** Indicators **/
exports.getAllIndicators = function (sources) {
  var file = _DEFAULTS.files['indicators']['indicators'],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
    
      obj = file[id];

      if (obj) {
        item = {
          id: id,
          type: 'indicator'
        };

        if (sources) {
          item.attributes = obj;
        } else {
          item.attributes = {
            description: obj.description,
            goal_id: obj.goal_id,
            target_id: obj.target_id
          }
        }

        item.attributes.series = getSeries(id);

        acc.push(item);
      } else {
        throw {
          status: 404,
          detail: 'error attempting to get Indicator with id: ' + id,
          title: 'Error getting all Indicators'
        }
      }
      
      return acc;

    }, []);

  return data;
}

exports.getIndicatorById = function (id, sources) {
  var file = _DEFAULTS.files['indicators']['indicators'],
    obj,
    item;
      
  obj = file[id];
    
  if (obj) {
    
    delete obj.id;

    item = {
      id: id,
      type: 'indicator'
    };

    if (sources) {
      item.attributes = obj;
    } else {
      item.attributes = {
        description: obj.description,
        goal_id: obj.goal_id,
        target_id: obj.target_id
      }
    }

    item.attributes.series = getSeries(id);

  } else {
    throw {
      status: 404,
      detail: 'Unable to find indicator: ' + id,
      title: 'Error getting Indicator by Id'
    }
  }

  return item;
}

exports.getIndicatorsForGoal = function (goal_id, sources) {
  var file = _DEFAULTS.files['indicators']['indicators'],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
      
      obj = file[id];

      if (obj) {

        if (goal_id === obj['goal_id']) {
          delete obj.id;

          item = {
            id: id,
            type: 'indicator'
          };

          if (sources) {
            item.attributes = obj;
          } else {
            item.attributes = {
              description: obj.description,
              goal_id: obj.goal_id,
              target_id: obj.target_id
            }
          }

          item.attributes.series = getSeries(id);

          acc.push(item);

        }
        
      } else {
        throw {
          status: 404,
          detail: 'Unable to find Indicator for Goal ' + goal_id,
          title: 'Error getting Indicators for Goal'
        }
      }
      return acc;

    }, []);

  return data;
}

exports.getIndicatorsForTarget = function (target_id, sources) {
  var file = _DEFAULTS.files['indicators']['indicators'],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
      
      obj = file[id];

      if (obj) {

        if (target_id === obj['target_id']) {
          delete obj.id;

          item = {
            id: id,
            type: 'indicator'
          };

          if (sources) {
            item.attributes = obj;
          } else {
            item.attributes = {
              description: obj.description,
              goal_id: obj.goal_id,
              target_id: obj.target_id
            }
          }

          item.attributes.series = getSeries(id);

          acc.push(item);

        }
        
      } else {
        throw {
          status: 404,
          detail: 'Unable to find Indicators for Target ' + goal_id,
          title: 'Error getting Indicators for Target'
        }
      }
      return acc;

    }, []);

  return data;
}

exports.buildMetaObject = function (query, len, queryParams, messages) {
  var meta = {
    stats: {
      count: len
    },
    apiRoot: process.env.API_ROOT,
    resourceRoot: process.env.API_ROOT + query.baseUrl,
    request: process.env.API_ROOT + query.originalUrl
  };

  if (queryParams) {
    meta.queryParameters = queryParams;
  }

  if (messages) {
    meta.messages = [];
    meta.messages = messages;
  }

  return meta;
}