var Reflux = require('reflux');

var VenueActions = Reflux.createActions([
    "load",
    "log",
    "edit",
    "appendCtr",

    "requestAll",
    "requestResourceBySlug",
]);


module.exports = {
    VenueActions: VenueActions
};