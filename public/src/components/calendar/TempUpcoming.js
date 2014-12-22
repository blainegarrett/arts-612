var React = require('react');

var NiceDate = React.createClass({
    propTypes: {
        start: React.PropTypes.string,
        end: React.PropTypes.string,
        eventdate_type: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            start: this.props.start,
            end: this.props.end,
            eventdate_type: this.props.eventdate_type
        };
    },
    render: function () {
        var start, end, display_str, duration_hours, start_time_format, end_time_format, extra_minute;

        start = moment(Date.parse(this.state.start));
        end = moment(Date.parse(this.state.end));

        display_str = start.format("MMM Do") + ' - ' +  end.format("MMM Do");
        duration_hours = end.diff(start, 'hours');

        // this.state.eventdate_type == 'timed' might be a better indicator
        if (duration_hours < 15) {
            // Assumed to be a single timed event: Sat Nov 8th 7PM - 10:30PM

            start_time_format = 'hA';
            end_time_format = 'hA';

            if (start.minutes() > 0) {
                start_time_format = 'h:mmA';
            }

            if (end.minutes() > 0) {
                end_time_format = 'h:mmA';
            }

            extra_minute = ':mm';

            display_str = start.format("ddd MMM Do " + start_time_format);
            display_str += ' - ';
            display_str += end.format(end_time_format);
        }

        return <span>{ display_str }</span>;
    }
});

var TempEvent = React.createClass({
    render: function () {
        // Determine which ED we meant to show actually

        var ed = false;
        for (i in this.props.event_dates){
            this.props.event_dates[i];
            if (this.props.event_dates[i].type == this.props.ed_filter) {
                ed = this.props.event_dates[i];
            }
            
        }
        
        if (!ed) {
            ed = this.props.event_dates[0];
            console.error('Warning: Failed to find an ed for the below event with a ed.type matching "' + this.props.ed_filter  + '". Defaulting to first found one. ');
            console.error(this.props);
        }        

        return (<li className="event">
    		<div><a href={this.props.url} target="_blank"><span className="event-title">{this.props.name}</span></a></div>
            <div className="event-time"><NiceDate start={ ed.start } end={ ed.end } eventdate_type={ ed.type } /></div>
            <div className="event-venue-name">{ed.venue.name}</div>
            <div className="event-address">{ed.venue.address}</div>
    	</li>);
    }    
});


var TempEventsListMixin = {
    componentDidMount: function (){
        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                this.setState({event_data:data});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },

    render_templatexxx: function (){
        return <div className="panel-container">
            <div className="panel-header">{ this.state.col_name }</div>
            <div className="panel-content">
                 <TempEventList ed_filter={ this.state.ed_filter } event_data={this.state.event_data} />
            </div>
        </div>;
    }
}

var TempEventList = React.createClass({
    getInitialState: function () {
        return {ed_filter: this.props.ed_filter, event_data: this.props.event_data };
    },
    render: function (){
        var eventNodes;
        var ed_filter = this.props.ed_filter;

        if (this.props.event_data.results != undefined) {
            eventNodes = this.props.event_data.results.map(function (event) {
                return <TempEvent key={event.resource_id} name={event.name} ed_filter={ed_filter} url={event.url} event_dates={ event.event_dates }/>;
            });
        }
        
        return  <ul className="event-list">
            { eventNodes }
        </ul>
    }
});

var TempUpcoming = React.createClass({
    mixins: [TempEventsListMixin],

    getInitialState: function(){
        return {ed_filter: 'timed', 'col_name': 'OPENINGS & EVENTS', event_data: [], 'resource_url': '/api/events/upcoming'};
    },

    render: function () {
        return this.render_templatexxx()
    }
});

var TempEvents = React.createClass({
    mixins: [TempEventsListMixin],

    getInitialState: function(){
        return {ed_filter: 'reoccurring', 'col_name': 'NOW SHOWING', 'event_data': [], 'resource_url': '/api/events/nowshowing'};
    },

    render: function () {
        return this.render_templatexxx()
    }
});


module.exports = TempUpcoming