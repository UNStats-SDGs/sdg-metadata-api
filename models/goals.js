var fs = require('fs');

exports.getAllGoals = function (query, cb) {
  var out_json = {},
    data = [],
    meta = {},
    goals;

  try {
    // load up the goals
    goals = JSON.parse( fs.readFileSync('data/goals.json') );

    if (query.ids) {
      var qIds = query.ids.split(',').map(function (v) { return parseInt(v); });
      
      // swiped the Obj -> Array from here: https://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array
      Object.keys(goals.goals).map(function (value) { 
        if (qIds.indexOf(parseInt(value)) > -1) {
          delete goals.goals[value].id;
          
          data.push({
            id: parseInt(value),
            type: 'goal',
            attributes: goals.goals[value]
          });
        }        
      });
    } else {
      
      data = Object.keys(goals.goals).map(function (value) { 
        delete goals.goals[value].id;
        return {
          id: parseInt(value),
          type: 'goal',
          attributes: goals.goals[value]
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

    goals = JSON.parse( fs.readFileSync('data/goals.json') );

    var goal = goals.goals[id];
    if (!goal) {
      var msg = 'unable to find data for goal: ' + id;
      if (parseInt(id) < 1 || parseInt(id) > 17) {
        msg = 'please enter a goal number between 1 and 17';
      }
      throw new Error(msg);
    }

    delete goal.id;

    data = [{
      type: 'goal',
      id: parseInt(id),
      attributes: goal
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