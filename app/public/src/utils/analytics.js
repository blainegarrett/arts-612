
var set_page = function(url, title) {
    ga('set', { page: url, title: title });
};

var record = function (hitType, opt_fieldObject, retry_count) {
    /* General Purpose Recording helper */

    if (!retry_count) {
      retry_count = 0
    }


    if (global.ga) {
      global.ga('send', hitType, opt_fieldObject);
    }
    else {
      if (retry_count < 5) {
        setTimeout(record, 1000, opt_fieldObject, retry_count+1)
      }
      else {
        console.log('Failed to record analytic. global.ga not available after ' + retry_count + ' attempts.');
      }
    }

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