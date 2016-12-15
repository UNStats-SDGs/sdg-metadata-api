var utils = require('../utils/utils');

function getIdFromAttributes(data, field) {
  return data.map(function (serie) {
    return serie.attributes[field];
  });
}

exports.getAll = function (query, next, cb) {
  var out_json = { data: [] },
    data,
    queryParams = query.query,
    target,
    messages = [];

  try {
    
    var sources = false;
    if (queryParams && (queryParams.sources === 'true')) {
      sources = true;
    }

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = utils.getAllByIds(ids, 'series');
    } else {
      data = utils.getAll('series');
    }

    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = [];

        if (queryParams.filter && queryParams.filter.id) {
          goal_ids = getIdFromAttributes(data, 'goal_id');

          var goal_uniques = [...new Set(goal_ids)];

          goals = utils.getAllByIds(goal_uniques, 'goals');

        } else {
          goals = utils.getAll('goals');
        }
         
        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        if (queryParams.filter && queryParams.filter.id) {
          target_ids = getIdFromAttributes(data, 'target_id');
          
          var target_uniques = [...new Set(target_ids)];

          targets = utils.getAllByIds(target_uniques, 'targets');

        } else {
          targets = utils.getAll('targets');
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        if (queryParams.filter && queryParams.filter.id) {
          indicator_ids = getIdFromAttributes(data, 'indicator_id');
          
          var indicator_uniques = [...new Set(indicator_ids)];

          indicators = utils.getAllByIds(indicator_uniques, 'indicators');

        } else {
          indicators = utils.getAll('indicators');
        }

        out_json.included = out_json.included.concat( indicators );
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

exports.getAllForIndicator = function (query, next, cb) {
  var out_json = { data: [] },
    queryParams = query.query,
    goal_id = query.params.id,
    target_id = query.params.target_id,
    indicator_id = (query.params.indicator_id) ? query.params.indicator_id : query.params.id,
    data,
    messages = [];

  try {

    if (queryParams && queryParams.filter && queryParams.filter.id) {
      var ids = queryParams.filter.id.split(',');

      data = utils.getAllByIds(ids, 'series');
    } else {
      data = utils.getChildren(indicator_id, 'indicator_id', 'series');
    }
    
    out_json.data = data;

    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goals = [];

        if (queryParams.filter && queryParams.filter.id) {
          goal_ids = getIdFromAttributes(data, 'goal_id');

          var goal_uniques = [...new Set(goal_ids)];

          goals = utils.getAllByIds(goal_uniques, 'goals');

        } else {
          goals = utils.getAll('goals');
        }
         
        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        if (queryParams.filter && queryParams.filter.id) {          
          target_ids = getIdFromAttributes(data, 'target_id');
          
          var target_uniques = [...new Set(target_ids)];

          targets = utils.getAllByIds(target_uniques, 'targets');

        } else {
          targets = utils.getAll('targets');
        }

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams && (queryParams.sources === 'true')) {
          sources = true;
        }

        if (queryParams.filter && queryParams.filter.id) {          
          indicator_ids = getIdFromAttributes(data, 'indicator_id');
          
          var indicator_uniques = [...new Set(indicator_ids)];

          indicators = utils.getAllByIds(indicator_uniques, 'indicators', sources);

        } else {
          indicators = utils.getAll('indicators');
        }

        out_json.included = out_json.included.concat( indicators );
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
    queryParams = query.query,
    series_id = (query.params.series_id) ? query.params.series_id : query.params.id,
    data,
    messages = [];

  try {
    
    data = utils.getAllByIds([series_id], 'series');
    
    out_json.data = data[0];
    
    if (queryParams && queryParams.include) {
      var includes = queryParams.include.split(',');
      
      out_json.included = [];

      if (includes.indexOf('goals') > -1) {
        var goal_ids = getIdFromAttributes(data, 'goal_id');

        var goal_uniques = [...new Set(goal_ids)];

        goals = utils.getAllByIds(goal_uniques, 'goals');

        out_json.included = out_json.included.concat( goals );
      }

      if (includes.indexOf('targets') > -1) {
        var targets_ids = getIdFromAttributes(data, 'target_id');

        var target_uniques = [...new Set(targets_ids)];

        targets = utils.getAllByIds(target_uniques, 'targets');

        out_json.included = out_json.included.concat( targets );
      }

      if (includes.indexOf('indicators') > -1) {
        var sources = false;
        if (queryParams && (queryParams.sources === 'true')) {
          sources = true;
        }

        var indicator_ids = getIdFromAttributes(data, 'indicator_id');

        var indicator_uniques = [...new Set(indicator_ids)];

        var indicators = utils.getAllByIds(indicator_uniques, 'indicators', sources);

        out_json.included = out_json.included.concat( indicators );
      }
    }

    if (queryParams && queryParams.refarea) {

      var params = [];

      // for each refarea
      var areas = (queryParams.refarea) ? queryParams.refarea.split(',') : [];
      var years = (queryParams.years) ? queryParams.years.split(',') : ['latest'];
      var sexes = (queryParams.sex) ? queryParams.sex.split(',') : ['T', 'F', 'M'];
      var ages = (queryParams.age) ? queryParams.age.split(',') : ['000_099_Y'];

      // create combinations for "features" to return based on query parameters and/or defaults
      areas.forEach(function (area) {
        years.forEach(function (year) {
          sexes.forEach(function (sex) {
            ages.forEach(function (age) {
              params.push({
                refarea: area,
                year: year,
                sex: sex,
                age: age
              });
            });
          });
        });
      });

      // console.log('params', params);
      // console.log('--------------------------------');
      
      var features = [], valueIsString = false;

      params.forEach(function (param) {
        var feature = {}, series_data = {}, attributes;
        
        series_data = utils.getSeriesDataByRefArea(series_id, param);

        // if we have series data
        if (series_data) {

          // console.log('param', param);
          // console.log('out_json.data', out_json.data);
          // console.log('series_data', series_data);
          // console.log('--------------------------------');

          attributes = Object.assign({}, series_data, out_json.data.attributes);
          // console.log('attributes', attributes);
          
          var base_atts;
          if (queryParams.returnGeometry === 'true') {

            if (queryParams.f === 'esrijson') {
              base_atts = utils.getEsriJsonGeometryForArea(param.refarea);
              
              feature.attributes = Object.assign({}, attributes, base_atts.attributes);
              feature.geometry = base_atts.geometry;

              if (typeof attributes.value === 'string') {
                valueIsString = true;
              }
            } else {
              base_atts = utils.getGeoJsonGeometryForArea(param.refarea);
              
              if (queryParams.f === 'geojson') {
                feature.properties = Object.assign({}, attributes, base_atts.properties);
                feature.geometry = base_atts.geometry;
              } else {
                feature.attributes = Object.assign({}, { geometry: base_atts.geometry }, attributes, base_atts.properties);
              }
            }

          } else {
            feature.id = out_json.data.id;
            feature.type = out_json.data.type;
            
            base_atts = _DEFAULTS.ref_area_sdg[attributes.refarea];
            feature.attributes = Object.assign({}, attributes, base_atts);
          }

          features.push( feature );

        }
      });

      // check again to adjust response
      if (queryParams.returnGeometry === 'true') {
        if (queryParams.f === 'esrijson') {
          out_json = utils.getEsriJsonTemplate();
          // the value for the series isn't always a Number. check for string and adjust esriFieldType<whatever>
          if (valueIsString) {
            out_json.fields.forEach( (field) => { if (field.name === 'value') { field.type === 'esriFieldTypeString'; } });
          }
          out_json.features = features;
        } else if (queryParams.f === 'esrijsonfc') {
          // var fc_base = utils.getEsriJsonFcTemplate();
          var fc_base = {};
          var fs_base = utils.getEsriJsonTemplate();
          // the value for the series isn't always a Number. check for string and adjust esriFieldType<whatever>
          if (valueIsString) {
            fs_base.fields.forEach( (field) => { if (field.name === 'value') { field.type === 'esriFieldTypeString'; } });
          }
          fc_base.layers = [
            {
              layerDefinition: {
                geometryType: 'esriGeometryPolygon',
                type: 'Feature Layer',
                drawingInfo: {},
                fields: [],
                types: [],
                capabilities: 'Query',
                name: 'test',
                templates: []
              },
              featureSet: {
                features: features,
                geometryType: 'esriGeometryPolygon'
              }
            }
          ];

          out_json = fc_base;
        } else {
          if (queryParams.f === 'geojson') {
            out_json = utils.getGeoJsonTemplate();
            out_json.features = features;
          } else{
            delete out_json.data;
            out_json.data = features;
          }
        }
      } else {
        out_json.data = features;
      }
    }

    if (queryParams 
        && queryParams.f !== 'geojson' 
        && queryParams.f !== 'esrijson'
        && queryParams.f !== 'esrijsonfc') {

      out_json.meta = utils.buildMetaObject(query, out_json.data.length, queryParams, messages.length > 0 ? messages : null);
    }

  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}

exports.describeSeries = function (query, next, cb) {
  var out_json = {},
    series_id = (query.params.series_id) ? query.params.series_id : query.params.id;
  
  try {
    out_json = utils.describeSeriesDimension(series_id);
  }
  catch (ex) {
    console.log(ex);

    next(ex);
  }

  cb(null, out_json);
}