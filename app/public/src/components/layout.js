var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Layout = React.createClass({

  render: function() {
    console.log('Layout Render Called...');

    return (
      <div className="App">
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Layout;