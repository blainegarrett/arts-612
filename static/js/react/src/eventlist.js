/** @jsx React.DOM */

/*
var Time = React.createClass({
    propTypes: {
        date: React.PropTypes.string,
        pattern: React.PropTypes.string
    },
    
    getDefaultProps: function () {
        return {
            date: null,
            pattern: "MMM D, YYYY, h:mm A"
        }
    },
    getTimeFromDate: function () {
        return !data ? new Date() : 
    }
});
*/

var NiceDate = React.createClass({
    render: function() {
        //start = Date.parse(self.props.start);
        //end = Date.parse(self.props.end);

        var start = moment(Date.parse(this.props.start));
        var end = moment(Date.parse(this.props.end));
        var eventdate_type = this.props.eventdate_type;

        display_str = start.format("MMM Do") + ' - ' +  end.format("MMM Do")
        duration_hours = end.diff(start, 'hours');

        if (duration_hours < 15 ){ // eventdate_type == 'timed' might be a better indicator
            // Assumed to be a single timed event: Sat Nov 8th 7PM - 10:30PM
            
            start_time_format = 'hA';
            end_time_format = 'hA';
            
            if (start.minutes() > 0) {
                start_time_format = 'h:mmA';
            }

            if (end.minutes() > 0) {
                end_time_format = 'h:mmA';
            }

            extra_minute = ':mm'
            
            display_str = start.format("ddd MMM Do " + start_time_format);
            display_str += ' - '
            display_str += end.format(end_time_format);
        }

        return <span>{ display_str }</span>;
    }
});

var TempEvent = React.createClass({
    
    render: function() {

        var ed = this.props.event_dates[0];

        return (<li className="event">
    		<div><a href={this.props.xxurl} target="_blank"><span className="event-title">{this.props.name}</span></a></div>
            <div className="event-time"><NiceDate start={ ed.start } end={ ed.end } eventdate_type={ ed.type } /></div>
            <div className="event-venue-name">{ed.venue.name}</div>
            <div className="event-address">{ed.venue.address}</div>
    	</li>);
    }    
});

var TempEventsListMixin = {
    componentDidMount: function(){
        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function(data) {
                this.setState({event_data:data});

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },

    render_templatexxx: function(){
        return <div className="panel-container">
            <div className="panel-header">{ this.state.col_name }</div>
            <div className="panel-content">
                 <TempEventList event_data={this.state.event_data} />
            </div>
        </div>;
    }
}

var TempEventList = React.createClass({
    render: function(){
        var eventNodes;

        if (this.props.event_data.results != undefined) {
            eventNodes = this.props.event_data.results.map(function (event) {
                return <TempEvent name={event.name} xxurl={event.url} event_dates={ event.event_dates }/>;
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
        return {'col_name': 'OPENINGS & EVENTS', event_data: [], 'resource_url': '/api/events/upcoming'};
    },
    render: function() {
        return this.render_templatexxx()
    }
});
mainApp.value('TempUpcoming', TempUpcoming);



var TempEvents = React.createClass({
    mixins: [TempEventsListMixin],
    getInitialState: function(){
        return {'col_name': 'NOW SHOWING', 'event_data': [], 'resource_url': '/api/events/nowshowing'};
    },

    render: function() {
        return this.render_templatexxx()
    }
});
mainApp.value('TempEvents', TempEvents);
