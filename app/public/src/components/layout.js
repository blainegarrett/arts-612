var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var App = React.createClass({

  render: function() {
    console.log('Layout Render Called...');

    return (
      <div className="App">
            <span>{ this.props }</span>
            <RouteHandler />
      </div>
    );
  }
});

module.exports = App;