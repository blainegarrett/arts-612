var React = require('react');

var GoodNewsBanner = React.createClass({
    render: function () {
        return <div className="row">
      	    <div className="col-md-12" id="welcome-header-container">
    			<h1 id="welcome-header">GOOD NEWS, MINNEAPOLIS</h1>
    		</div>
    	</div>;
    }
});

module.exports = GoodNewsBanner;
