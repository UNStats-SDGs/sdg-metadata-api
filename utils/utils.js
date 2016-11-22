// swiped the Obj -> Array from here: https://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array

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

        acc.push(item);
      }
      return acc;

    }, []);

  retObj.data = data;

  return retObj;
}