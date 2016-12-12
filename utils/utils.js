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

exports.getAll = function (type, sources) {  
  var file = _DEFAULTS.files[type][type],
    obj,
    item,
    data;

  data = Object.keys(file)
    .map(function (value) { 
    
      obj = file[value];

      item = {
        id: value,
        type: _DEFAULTS.model_type[type]
      };

      if (type === 'indicators') {
        if (sources) {
          item.attributes = obj;
        } else {
          item.attributes = {
            goal_id: obj.goal_id,
            target_id: obj.target_id,
            description: obj.description
          }
        }
      } else {
        item.attributes = obj;
      } 

      return item;

    });

  return data;
}

exports.getAllByIds = function (ids, type, sources) {
  var file = _DEFAULTS.files[type][type],
    obj,
    item,
    data;

  data = ids
    .reduce(function (acc, id) {
      
      obj = file[id];
      
      if (obj) {
        
        delete obj.id;

        item = {
          id: id,
          type: _DEFAULTS.model_type[type]
        };

        if (type === 'indicators') {
          if (sources) {
            item.attributes = obj;
          } else {
            item.attributes = {
              goal_id: obj.goal_id,
              target_id: obj.target_id,
              description: obj.description
            }
          }
        } else {
          item.attributes = obj;
        }

        acc.push(item);
      } else {
        
        console.log(id);

        throw {
          title: 'Resource not found',
          status: 404,
          detail: 'Unable to find ' + _DEFAULTS.model_type[type] + ' with id of ' + id
        }
      } 
      
      return acc;

    },[]); 

    return data;
}

exports.getChildren = function (parentId, parentField, outType, sources) {
  var file = _DEFAULTS.files[outType][outType],
    obj,
    item,
    data;

  data = Object.keys(file)
    .reduce(function (acc, id) { 
      
      obj = file[id];

      if (obj && (parentId === obj[parentField]) ) {
        
        delete obj.id;

        item = {
          id: id,
          type: _DEFAULTS.model_type[outType]
        };
        
        if (outType === 'indicators') {
          if (sources) {
            item.attributes = obj;
          } else {
            item.attributes = {
              goal_id: obj.goal_id,
              target_id: obj.target_id,
              description: obj.description
            }
          }
        } else {
          item.attributes = obj;
        }

        acc.push(item);
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