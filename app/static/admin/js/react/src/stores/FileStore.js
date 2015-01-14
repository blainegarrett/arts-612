/*
 * FileStore - storage and operations on page meta
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
//var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _file_list = {'jive' : []};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */

function set(payload) {
    /* TODO: Apply Defaults */
    _file_list = payload;
}

function mergeo (obj1, obj2){
    for (var attrname in obj2) { 
        obj1[attrname] = obj2[attrname]; 
    }
    
    console.log()
    return obj1;
}

var FileStore = assign({}, EventEmitter.prototype, {
    addRecord: function (file_data) {
        var store_id = Math.floor((Math.random() * 100000000) + 1);

        file_data.store_id = store_id;
        _file_list.jive.push(file_data);
    },
    updateRecord: function(store_id, file_data) {
        var record = null;

        //alert('updating record with: ');
        console.log('INSIDE FileStore.updateRecord');
        console.error(file_data);


        for (var i = 0; i < _file_list.jive.length; i++) {
            if (_file_list.jive[i].store_id == store_id) {
              _file_list.jive[i] = assign({}, _file_list.jive[i], file_data);
              //alert('found record!!!');
              //console.error(_file_list.jive[i]);
              
            };
        }
        console.log("didn't find record");
        
    },

  getRaw: function() {
    return _file_list;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  
  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});




// Register to handle all updates
AppDispatcher.register(function(payload) {
  var signal = payload.signal;
  var text;

  console.log('App Dispatcher recieved a signal: ' + signal); 
  console.log(payload);
  
  
  if (signal == 'ADDFILES') {
      for (var i = 0; i < payload['payload'].length; i++) {
          FileStore.addRecord(payload['payload'][i])
      }
      //_file_list['jive'] = _file_list['jive'].concat(payload['payload']) // ug... bad naming convention...
  }
  else if (signal == 'UPDATEFILES') {
      console.log('__________SDFSDFSDFSDFDSFSDFSDFSDFSDFSDFSD--------');
      console.log(payload);
      
      
      for (var i = 0; i < payload['payload'].length; i++) {
          FileStore.updateRecord(payload['payload'][i].store_id, payload['payload'][i])
      }
  }
  else {
      alert('UnExpected Signal...' + signal);
  }

  //_file_list['jive'].push(payload['file_obj']);

  //_file_list = payload; // set
  FileStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = FileStore;