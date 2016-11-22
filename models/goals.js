var utils = require('../utils/utils');


exports.getAll = function (query, cb) {
  var out_json = { data: [], meta: {} },
    data,
    goal;

  try {
    
    if (query.ids) {
      
      data = utils.getAllByIds(query.ids.split(','), 'goals');

    } else {
           
      data = utils.getAll('goals');
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
    id = query.params.id,
    data;

  try {
    if (!query.params && !query.params.id) {
      throw new Error('no id specified');
    }

    data = utils.getAllByIds([id], 'goals');
       
    out_json.data = data.data;

    if (data.messages) {
      out_json.meta.messages = data.messages;
    }
  }
  catch (ex) {
    console.log(ex);

    delete out_json.data;

    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: ex.message
    });
  }

  cb(null, out_json);
}

// exports.getTargetsByGoalId = function (query, cb) {
//   var out_json = { data: [], meta: {} },
//     id = query.params.id,
//     data;

//   try {
       
//     data = utils.getChildren(id, 'goal_id', 'targets');

//     out_json.data = data.data;
    
//     if (data.messages) {
//       out_json.meta.messages = data.messages;
//     }
//   }
//   catch (ex) {
//     console.log(ex);

//     if (out_json.data) {
//       delete out_json.data;
//     }

//     out_json.errors = [];
//     out_json.errors.push({
//       status: '',
//       detail: ex.message
//     });
//   }

//   cb(null, out_json);
// }

// exports.getTarget = function (query, cb) {
//   var goal_id = query.params.id,
//     target_id = query.params.target_id;

//   if (target_id.substr(0, target_id.indexOf('.')) !== goal_id) {
//     throw new Error('The combination of Target ' + target_id + ' and Goal ' + goal_id + ' have no Indicators');
//   }

//   utils.getAllByIds(query, cb);
// }

// exports.getIndicatorsForTarget = function (query, cb) {
//   var out_json = { data: [], meta: {} },
//     target_id = query.params.target_id,
//     goal_id = query.params.id,
//     data;

//   try {
    
//     if (target_id.substr(0, target_id.indexOf('.')) !== goal_id) {
//       throw new Error('The combination of Target ' + target_id + ' and Goal ' + goal_id + ' have no Indicators');
//     }

//     data = utils.getChildren(target_id, 'target_id', 'indicators');

//     out_json.data = data.data;
    
//     if (data.messages) {
//       out_json.meta.messages = data.messages;
//     }
//   }
//   catch (ex) {
//     console.log(ex);

//     if (out_json.data) {
//       delete out_json.data;
//     }

//     out_json.errors = [];
//     out_json.errors.push({
//       status: '',
//       detail: ex.message
//     });
//   }

//   cb(null, out_json);
// }

// exports.getIndicator = function (query, cb) {
//   var out_json = { data: [], meta: {} },
//     id = query.params.id,
//     target_id = query.params.target_id,
//     indicator_id = query.params.indicator_id,
//     data;

//   try {

//     if (target_id.substr(0, target_id.lastIndexOf('.')) !== id || 
//         indicator_id.substr(0, indicator_id.lastIndexOf('.')) !== target_id) {

//       throw new Error('The combination of Target ' + target_id + ', Goal ' + id + ', and Indicator ' + indicator_id + ' are not aligned.');
//     }
       
//     data = utils.getAllByIds([indicator_id], 'indicators');

//     out_json.data = data.data;
    
//     if (data.messages) {
//       out_json.meta.messages = data.messages;
//     }
//   }
//   catch (ex) {
//     console.log(ex);

//     if (out_json.data) {
//       delete out_json.data;
//     }

//     out_json.errors = [];
//     out_json.errors.push({
//       status: '',
//       detail: ex.message
//     });
//   }

//   cb(null, out_json);
// }