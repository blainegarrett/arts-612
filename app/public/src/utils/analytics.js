
var set_page = function(url, title) {
    ga('set', { page: url, title: title });
};

var record = function (hitType, opt_fieldObject) {
    /* General Purpose Recording helper */
    
    global.ga('send', hitType, opt_fieldObject);
    //console.log('sending ' + hitType + '.');
    //console.log(opt_fieldObject)
};


var record_event = function (eventCategory, eventAction, eventLabel, eventValue) {
    // Wrapper for event recording
    
    //console.log(this);

    var data = {
      'eventCategory': eventCategory,   // Required.
      'eventAction': eventAction,      // Required.
      'eventLabel': eventLabel,
      'eventValue': eventValue
    };

    record('event', data);
}

module.exports = {
    record: record,
    record_event: record_event
}