var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var EventsForm = require('./../forms/EventsForm');

var EventsCreatePage = React.createClass({
    render: function() {

        var resource_url = '/api/events';
        var save_callback = function() {
            window.location = '/admin/events';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/venues">Events</a> / Create</h2>
                <EventsForm resource_url={resource_url} is_edit={false} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = EventsCreatePage