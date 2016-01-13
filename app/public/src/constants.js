// General Site constants - don't let this get too bloated
var moment = require('moment-timezone');

var CENTRAL_TIMEZONE = "America/Chicago"

try { var BROWSER_TIMEZONE = moment.tz.guess(); }
catch (err) { var BROWSER_TIMEZONE = "America/Chicago"; }

var IS_BROWSER_CENTRAL_TIMEZEZONE = CENTRAL_TIMEZONE == BROWSER_TIMEZONE;

module.exports = {
    TONIGHT_END_DATE_UTC: moment.utc(moment().hour(9).minute(0).second(0)),
    CENTRAL_TIMEZONE: CENTRAL_TIMEZONE,
    BROWSER_TIMEZONE: BROWSER_TIMEZONE,
    IS_BROWSER_CENTRAL_TIMEZEZONE: IS_BROWSER_CENTRAL_TIMEZEZONE
}