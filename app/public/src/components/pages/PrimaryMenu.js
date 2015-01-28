/* TODO: Active state needs to be based on some global routing */

var React = require('react');
var ReactRouter = require('flux-react-router');

var PrimaryMenu = React.createClass({
    render: function() {
        return <ul className="nav navbar-nav">
          <li><a onClick={ReactRouter.deferTo('/app/')}>Home</a></li>
          <li><a onClick={ReactRouter.deferTo('/app/galleries')}>Galleries</a></li>
          <li><a onClick={ReactRouter.deferTo('/app/calendar')}>Calendar</a></li>
        </ul>
    }
});

module.exports = PrimaryMenu;

