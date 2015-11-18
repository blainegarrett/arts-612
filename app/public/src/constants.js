// General Site constants - don't let this get too bloated
var moment = require('moment');

module.exports = {
    TONIGHT_END_DATE_UTC: moment.utc(moment().hour(9).minute(0).second(0))
}


alert('Imported???');