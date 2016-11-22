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