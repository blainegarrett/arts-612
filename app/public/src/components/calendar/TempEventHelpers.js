/*
Temporary Events widget for Alpha Version of the site. We can easily delete theis after the April Launch
Along with: TempEventHelpers, TempEvents, TempUpcoming
*/

var React = require('react');
var EventGoober = require('./../DataTypes/Event').EventGoober;
var AlphaEventRenderer = require('./../DataTypes/Event').AlphaEventRenderer;

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
};

var TempEventList = React.createClass({
    getInitialState: function () {
        return {
            ed_filter: this.props.ed_filter,
            event_data: this.props.event_data
        };
    },

    render: function (){
        var eventNodes = [];
        var ed_filter = this.state.ed_filter;
        if (this.props.event_data.results != undefined) {
            eventNodes = this.props.event_data.results.map(function (event) {
                return <EventGoober key={ event.resource_id } resource={ event } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />
            });
        }
        else {
            eventNodes.push(<EventGoober key={ 'xxx1' } resource={ null } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />)
            eventNodes.push(<EventGoober key={ 'xxx2' } resource={ null } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />)
            eventNodes.push(<EventGoober key={ 'xxx3' } resource={ null } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />)
            eventNodes.push(<EventGoober key={ 'xxx4' } resource={ null } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />)
            eventNodes.push(<EventGoober key={ 'xxx5' } resource={ null } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />)
            eventNodes.push(<EventGoober key={ 'xxx6' } resource={ null } ed_filter={ ed_filter } renderer={ AlphaEventRenderer } />)
        };

        return  <ul className="event-list">{ eventNodes }</ul>
    }
});


module.exports = {
    TempEventsListMixin: TempEventsListMixin
}