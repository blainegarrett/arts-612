/*
Temporary Events widget for Alpha Version of the site. We can easily delete theis after the April Launch
Along with: TempEventHelpers, TempEvents, TempUpcoming
*/

var React = require('react');
var EventGoober = require('./../DataTypes/Event').Goober;
var PodRenderer = require('./../DataTypes/Event').PodRenderer;
var AdvertModule = require('./../DataTypes/Advert');

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

    render_templatexxx: function () {
        // Show in 1st col if on mobile, else 2nd col
        if (this.state.ed_filter == 'timed') {
            var ad_display_class = ['hidden-md hidden-lg'];
        }
        else{
            var ad_display_class = ['hidden-sm'];
        }

        return (
            <div className="panel-container">
                <div className={ ad_display_class}>
                    <AdvertModule.Goober resource={AdvertModule.get_random()} renderer={ AdvertModule.PodRenderer} />
                </div>

                <div className="panel-header">{ this.state.col_name }</div>
                <div className="panel-content">
                 <TempEventList ed_filter={ this.state.ed_filter } event_data={this.state.event_data} />
                </div>
            </div>);
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
                return (
                    <div className="col sm12" key={ event.resource_id }>
                        <div className="card hoverable">
                            <EventGoober resource={ event } ed_filter={ ed_filter } renderer={ PodRenderer } />
                        </div>
                    </div>);
            });
        }
        else {
            eventNodes.push(<div className="col s12" key={ 'xxx1' }><div className="card"><EventGoober resource={ null } ed_filter={ ed_filter } renderer={ PodRenderer } /></div></div>)
            eventNodes.push(<div className="col s12" key={ 'xxx2' }><div className="card"><EventGoober resource={ null } ed_filter={ ed_filter } renderer={ PodRenderer } /></div></div>)
            eventNodes.push(<div className="col s12" key={ 'xxx3' }><div className="card"><EventGoober resource={ null } ed_filter={ ed_filter } renderer={ PodRenderer } /></div></div>)
            eventNodes.push(<div className="col s12" key={ 'xxx4' }><div className="card"><EventGoober resource={ null } ed_filter={ ed_filter } renderer={ PodRenderer } /></div></div>)
            eventNodes.push(<div className="col s12" key={ 'xxx5' }><div className="card"><EventGoober resource={ null } ed_filter={ ed_filter } renderer={ PodRenderer } /></div></div>)
            eventNodes.push(<div className="col s12" key={ 'xxx6' }><div className="card"><EventGoober resource={ null } ed_filter={ ed_filter } renderer={ PodRenderer } /></div></div>)
        };

        return  <div className="row">{ eventNodes }</div>
    }
});


module.exports = {
    TempEventsListMixin: TempEventsListMixin
}