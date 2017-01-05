// swiped the Obj -> Array from here: https://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array
var fs = require('fs');

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

        // re-format series key
        if (type === 'series') {
          item.attributes.is_official = item.attributes.isOfficial || false;
          delete item.attributes.isOfficial;
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

  console.log(data);
  
  return data;
}

exports.getSeriesDataByRefArea = function (series_id, param) {
  var file_path = _DEFAULTS.files.series_areas_data_path + param.refarea + '.json';
  
  var file = JSON.parse( fs.readFileSync( file_path ) );

  if (param.year === 'latest') {
    year = 0;
    file.forEach(function (item) {
      if (item.SERIES === series_id) {
        year = Math.max(year, parseInt(item.TIMEPERIOD));
      }
    });

    param.year = year.toString();
  }

  var data = file.reduce(function (acc, item) {
    // console.log('item', item);
    if (item.SERIES === series_id 
        && item.TIMEPERIOD === param.year
        && item.SEX === param.sex
        && item.AGEGROUP === param.age ) {

      var obj = {};
      
      var value = item.OBSVALUE;
      if (value.indexOf('>') === -1 && value.indexOf('<') === -1) {
        value = parseFloat(item.OBSVALUE);
      }

      var units = _DEFAULTS.unit_sdg[item.UNIT] || 'NA';
      var mult = _DEFAULTS.unit_mult[item.UNITMULT];
      var sex = _DEFAULTS.sex[item.SEX] || 'Both sexes or no breakdown by sex';
      var frequency = _DEFAULTS.freq[item.FREQ] || 'NA';
      var age_group = _DEFAULTS.age_group[item.AGEGROUP] || 'All age ranges or no breakdown by age';
      var nature = _DEFAULTS.nature_sdg[item.NATURE] || 'NA';
      var source_type = _DEFAULTS.source_type_sdg[item.SOURCETYPE] || 'NA';
      var location_type = _DEFAULTS.location_type_sdg[item.LOCATION] || 'NA';

      obj = {
        age_group: age_group.description,
        sex: sex.description,
        year: item.TIMEPERIOD,
        refarea: param.refarea,
        value: value,
        units: units.description,
        frequency: frequency.description,
        footnotes: item.FOOTNOTES,
        source_type: source_type.description,
        source_detail: item.SOURCEDETAIL,
        nature: nature.description,
        location_type: location_type.description
      };

      if (item.UNITMULT !== '0' && mult) {
        obj.unit_multiplier = mult.description;
        // may not need to do any extra calcs here on 
      }
      
      acc.push(obj);
    }
    return acc;
  }, []);
  
  return data[0] ||  null;
}

var geoJsonGeometryCache = {};
exports.getGeoJsonGeometryForArea = function (refarea) {
  // if (geoJsonGeometryCache[refarea]) {
  //   return geoJsonGeometryCache[refarea];
  // }

  var file_path = _DEFAULTS.files.geometry_path + '/' + refarea + '-geo.json'

  var file = null;
  try {
    file = JSON.parse( fs.readFileSync( file_path ) );
  }
  catch (ex) {
    // do nothing right now
  }

  return file;

  // if (file && file.geometry) {
  //   geoJsonGeometryCache[refarea] = file;
  //   return file; 
  // } else {
  //   return null;
  // }
}

exports.getGeoJsonTemplate = function (refarea, series_atts_base, series_atts_value) {
 return {
    type: 'FeatureCollection',
    crs: {
      type: 'name', 
      properties: { name: 'EPSG:3857' }
    },
    features: []              
  };
} 


var esriJsonGeometryCache = {};
exports.getEsriJsonGeometryForArea = function (refarea) {
  
  // if (esriJsonGeometryCache[refarea]) {
  //   // console.log('adding : ' + refarea + ' geom from cache');
  //   return esriJsonGeometryCache[refarea];
  // }

  var file_path = _DEFAULTS.files.geometry_path + '/' + refarea + '-esri.json'

  var file = null;
  try {
    file = JSON.parse( fs.readFileSync( file_path ) );
  }
  catch (ex) {
    // do nothing right now
  }

  return file;

  // if (file && file.geometry) {
  //   esriJsonGeometryCache[refarea] = file;
  //   return file; 
  // } else {
  //   return null;
  // }
}

exports.getEsriJsonTemplate = function () {
  return {
    geometryType: 'esriGeometryPolygon',
    spatialReference: {
      wkid: 102100,
      latestWkid: 3857                
    },
    fields: [
      { name: 'description', alias: 'Description', type: 'esriFieldTypeString' },
      { name: 'indicator_id', alias: 'Indicator Id', type: 'esriFieldTypeString' },
      { name: 'target_id', alias: 'Target Id', type: 'esriFieldTypeString' },
      { name: 'goal_id', alias: 'Goal Id', type: 'esriFieldTypeString' },
      { name: 'sex', alias: 'Sex', type: 'esriFieldTypeString' },
      { name: 'year', alias: 'Year', type: 'esriFieldTypeString' },
      { name: 'frequency', alias: 'Frequency', type: 'esriFieldTypeString' },
      { name: 'refarea', alias: 'Reference Area (3 Digit Code)', type: 'esriFieldTypeString' },
      { name: 'value', alias: 'Value', type: 'esriFieldTypeDouble' },
      { name: 'units', alias: 'Units', type: 'esriFieldTypeString' },
      { name: 'show', alias: 'Show', type: 'esriFieldTypeString' },
      { name: 'is_official', alias: 'Is Official', type: 'esriFieldTypeString' },
      { name: 'iso3_code', alias: 'ISO 3 Digit Code', type: 'esriFieldTypeString' },
      { name: 'iso2_code', alias: 'ISO 2 Digit Code', type: 'esriFieldTypeString' },
      { name: 'area_name', alias: 'Area Name', type: 'esriFieldTypeString' },
      { name: 'footnotes', alias: 'Footnotes', type: 'esriFieldTypeString' },
      { name: 'source_detail', alias: 'Source Detail', type: 'esriFieldTypeString' },
      { name: 'source_type', alias: 'Source Type', type: 'esriFieldTypeString' },
      { name: 'nature', alias: 'Nature', type: 'esriFieldTypeString' },
      { name: 'location_type', alias: 'Location Type', type: 'esriFieldTypeString' }
    ],
    features: []              
  };
}

exports.getEsriJsonFcTemplate = function () {
 return {
  
 }
}

exports.describeSeriesDimension = function (series_id) {
  var file_path = _DEFAULTS.files.series_ids_data_path + series_id + '.json';
  
  var file = JSON.parse( fs.readFileSync( file_path ) );

  var output = {
    refareas: [],
    time_periods: [],
    ages: [],
    sexes: []
  };
  
  file.forEach(function (item) {
    if (item.SERIES === series_id) {
      if (output.refareas.indexOf(item.REFAREA) === -1) {
        output.refareas.push(item.REFAREA);
      }

      if (output.time_periods.indexOf(item.TIMEPERIOD) === -1) {
        output.time_periods.push(item.TIMEPERIOD);
      }

      if (output.ages.indexOf(item.AGEGROUP) === -1) {
        output.ages.push(item.AGEGROUP);
      }

      if (output.sexes.indexOf(item.SEX) === -1) {
        output.sexes.push(item.SEX);
      }
    }
  });

  return output;
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