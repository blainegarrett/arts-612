var Reflux = require('reflux');

var BlogPostActions = Reflux.createActions([
    "requestAll",
    "requestMore"
]);


module.exports = {
    BlogPostActions: BlogPostActions
};