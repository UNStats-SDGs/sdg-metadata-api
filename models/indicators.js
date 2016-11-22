var utils = require('../utils/utils');

exports.getAll = function (query, cb) {
  var out_json = { data: [], meta: {} },
    data,
    target;

  try {
    
    if (query.ids) {
      console.log(query.ids);
      data = utils.getAllByIds(query.ids.split(','), 'indicators');
    } else if (query.params) { 
      var id = (query.params.target_id) ? query.params.target_id : query.params.id;
      data = utils.getChildren(id, 'target_id', 'indicators');
    } else {
      console.log(query);
      data = utils.getAll('indicators');
    }

    out_json.data = data.data;
    
    if (data.messages) {
      out_json.meta.messages = data.messages;
    }
  }
  catch (ex) {
    console.log(ex);

    if (out_json.data) {
      delete out_json.data;
    }

    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: ex.message
    });
  }

  cb(null, out_json);
}

exports.getById = function (query, cb) {
  var out_json = { data: [], meta: {} },
    id = (query.params.indicator_id) ? query.params.indicator_id : query.params.id,
    data;

  try {
    
    data = utils.getAllByIds([id], 'indicators');
    
    out_json.data = data.data;
    
    if (data.messages) {
      out_json.meta.messages = data.messages;
    }

  }
  catch (ex) {
    console.log(ex);

    if (out_json.data) {
      delete out_json.data;
    }

    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: ex.message
    });
  }

  cb(null, out_json);
}

exports.getField = function (query, cb) {

}