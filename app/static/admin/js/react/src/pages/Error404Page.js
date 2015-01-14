var React = require('react');

var Error404Page = React.createClass({
    render: function() {
        return <div><h2>404...</h2><p>This Page could not be found... <a href="/admin">Return to Admin Home...</a></p></div>
    }
});
module.exports = Error404Page;
