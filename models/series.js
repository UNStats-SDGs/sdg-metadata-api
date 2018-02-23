/* Copyright 2016 Esri
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.​ */
 
var alasql = require('alasql'),
  utils = require('../utils/utils');

exports.get = function (query, cb) {
  var out_json = {},
    data = [],
    meta = {},
    opts = {},
    base_sql = 'SELECT * FROM ?';
    
  try {
      opts.data = SERIES;
      //base_sql += ' WHERE code IN('+ utils.string_to_int(query.code) +')';
      if(query.code){
        opts.code = query.code;
        data = alasql('SELECT * FROM $data WHERE code=$code', opts);
      }
      else
        data = alasql('SELECT * FROM $data', opts);

      //base_sql += ' WHERE code IN('+ utils.string_to_int(query.code) +')';
      //data = alasql(base_sql, [ SERIES ]);
    
      data = data.map(function (series) {
        return series;
      },this);     

    out_json['data'] = data;
    out_json['meta'] = {};
  }
  catch (e) {
    console.log(e);
    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: e,
      source: ''
    });
  }

  cb(null, out_json);
}