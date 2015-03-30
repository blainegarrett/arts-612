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

module.exports = {
    Separator: Separator
}