/* Main Entry Point For App */
/*
var moment = require('moment');
var coolthing = require('./coolthing.js');
var React = require('react');

console.log('jive');
console.log(coolthing.derp.doit());
*/


var React = require('react')

var Hello = React.createClass({

  render: function() {
    return <div>Hello, {this.props.name}!</div>
  }
});

React.render(
  <Hello name="World" />,
  document.getElementById('hello')
)