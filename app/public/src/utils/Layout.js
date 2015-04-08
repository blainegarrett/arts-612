var React = require('react');

var Separator = React.createClass({
    render: function () {
        return <div className="row">
            <div className="col-sm-12">
                <div className="fancy-separator"></div>
            </div>
        </div>
    }
});

var LoadingSpinner = React.createClass({
    render: function () {
        return <div className="initial-loading-spinner">
            <i className="fa fa-spinner fa-pulse"></i>
        </div>;
    }
});


module.exports = {
    Separator: Separator,
    LoadingSpinner: LoadingSpinner
}