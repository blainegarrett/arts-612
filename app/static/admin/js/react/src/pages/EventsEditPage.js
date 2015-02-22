var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var EventsForm = require('./../forms/EventsForm');

var EventsEditPage = React.createClass({
    getInitialState: function(){
        return { data: null }
    },

    render: function() {

        var resource_url = '/api/events/' + this.props.keystr;
        var save_callback = function() {
            window.location = '/admin/events';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/venues">Events</a> / Edit</h2>
            </div>

            <div className="col-lg-12">            
                <EventsForm container={this}  ref="form" resource_url={resource_url} is_edit={true} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = EventsEditPage