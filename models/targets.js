var utils = require('../utils/utils');

exports.getAll = function (query, cb) {
  var out_json = { data: [], meta: {} },
    data,
    target;

  try {
    
    if (query.ids) {
      data = utils.getAllByIds(query.ids.split(','), 'targets');
    } else if (query.params && query.params.id) {
      data = utils.getChildren(query.params.id, 'goal_id', 'targets');
    } else {
      data = utils.getAll('targets');
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
    id = (query.params.target_id) ? query.params.target_id : query.params.id ,
    data;

  try {
    console.log(query.params);

    data = utils.getAllByIds([id], 'targets');
    
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