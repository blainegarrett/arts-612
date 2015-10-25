var Reflux = require('reflux');

var EventActions = Reflux.createActions([
    "load",
    "log",
    "edit",
    "appendCtr",
]);


module.exports = {
    EventActions: EventActions
};