var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var VenuesForm = require('./../forms/VenuesForm');

var VenuesCreatePage = React.createClass({
    render: function() {

        var resource_url = '/api/galleries';
        var save_callback = function() {
            window.location = '/admin/venues';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/venues">Venues</a> / Create</h2>
                <VenuesForm resource_url={resource_url} is_edit={false} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = VenuesCreatePage