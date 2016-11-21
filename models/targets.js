var fs = require('fs');

exports.getAllTargets = function (query, cb) {
  var out_json = {},
    data = [],
    meta = {},
    targets;

  try {
    // load up the targets
    targets = JSON.parse( fs.readFileSync('data/targets.json') );

    if (query.ids) {
      var qIds = query.ids.split(',');
      
      // swiped the Obj -> Array from here: https://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array
      Object.keys(targets.targets).map(function (value) { 
        if (qIds.indexOf(value) > -1) {
          delete targets.targets[value].id;
          
          data.push({
            id: value,
            type: 'target',
            attributes: targets.targets[value]
          });
        }        
      });
    } else {
      
      data = Object.keys(targets.targets).map(function (value) { 
        delete targets.targets[value].id;
        return {
          id: value,
          type: 'target',
          attributes: targets.targets[value]
        }; 
      });
    }

    out_json['data'] = data;
    out_json['meta'] = {};    
  }
  catch (ex) {
    console.log(ex);
    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: ex.message
    });
  }

  cb(null, out_json);
}

exports.getById = function (query, cb) {
  var out_json = {};

  try {
    if (!query.params && !query.params.id) {
      throw new Error('no id specified');
    }

    var id = query.params.id,
      data = [];

    targets = JSON.parse( fs.readFileSync('data/targets.json') );

    var target = targets.targets[id];
    if (!target) {
      throw new Error('unable to find data for target: ' + id);
    }

    delete target.id;

    data = [{
      type: 'target',
      id: id,
      attributes: target
    }];
    
    out_json.data = data;
    out_json.meta = {};

  }
  catch (ex) {
    console.log(ex);
    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: ex.message
    });
  }

  cb(null, out_json);
}