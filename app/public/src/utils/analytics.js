
var set_page(url, title) {
    ga('set', { page: url, title: title });
}
var record = function (hitType, opt_fieldObject) {

    alert('recording ' + hitType);
 
    console.log([hitType, opt_fieldObject]);

    global.ga('send', hitType, opt_fieldObject);

};


var record_event = function (eventCategory, eventAction, eventLabel, eventValue) {
    // Wrapper for event recording

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