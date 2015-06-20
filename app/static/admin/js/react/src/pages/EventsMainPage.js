var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var moment = require('moment');

var EventDateColumn = React.createClass({
    getInitialState: function(){
        return {col: this.props.col, obj: this.props.obj}
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var rendered_event_dates = '';

        if (obj.event_dates) {            
            rendered_event_dates = obj.event_dates.map(function (ed, i) {
                return <div key={ 'ed_' + i } className="small">
                { ed.category } -
                "{ ed.label }" - 
                { moment(ed.start).format('lll') }  - { moment(ed.end).format('lll') } 
                @ <a href={'/admin/venues/' + ed.venue.resource_id  + '/edit'}>{ ed.venue.name }</a></div>
            });
        }

        return <span>{rendered_event_dates}</span>;
    }
});

var EventsGrid = React.createClass({
    /* Grid of Events */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/events'};

        state['columns'] = ['name', 'category', 'featured', 'actions'];

        state['global_actions'] = [
            {
                title: 'Add Event',
                url: '/admin/events/create',
                icon: 'calendar'
            },  
        ];
        state['inline_actions'] = [
            {
                title: 'Edit',
                url: function(obj){ return '/admin/events/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },  
        ];

        state['column_widgets'] = {
            'category': EventDateColumn
        }
        

        return state;
    },

    render: function() {
        return <div>{this.render_templatexxx()}</div>
    }
});

var EventsMainPage = React.createClass({
    render: function() {
        return <div className="row">
                    <div className="col-lg-12">
                        <h2><a href="/admin">Admin</a> / Events</h2>  
                        <EventsGrid />
                </div>
            </div>;
    }
});
module.exports = EventsMainPage;