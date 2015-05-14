var React = require('react');
var moment = require('moment');


var FundraiserCard =  React.createClass({
    getInitialState: function () {
        return {
            resource: this.props.resource
            
        }
    },
    render: function() {
        
        var r = this.state.resource;

        var ends_node;
        
        if (r.end_date) {
            var end_date = moment(r.end_date)
            ends_node = <div className="card-detail fundraiser-end-date">Campaign ends { end_date.format('MMMM Do') }</div>;
        }

        return <div className="card-wrap">
            <div className="card-image">
                <a href={r.website} target="_new" title={ 'Support:' +  r.title } >
                    <img src={ r.img_url } className="img-responsive" title={ 'Support:' +  r.title } />
                </a>
            </div>
            <div className="card-content">
                <div className="card-detail event-time">Support local art:</div>
                <div className="card-title">
                    <a href={r.website} target="_new">{r.title}</a>
                </div>
                <div className="card-detail">{r.summary}</div>
                { ends_node }
            </div>
        
        </div>;

    }
});

var TempExtras = React.createClass({
    render: function () {
        
        var fundraisers = [
            {
                resource_id: 'fundraiser3',
                website: 'https://www.givemn.org/fundraiser/creating-language-through-arts54fdadc30e20c',
                title: 'Creating Language Through Arts',
                summary: 'Help support programs for Deaf/Hard of Hearing youth using art as a way of communicating that transcends speech and hearing. Contributions are tax deductable.',
                img_url: 'http://cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fNDAxMDAwMQ/card_small.png',
            }
        ];        
        
        
        var fundraisers_rendered = fundraisers.map(function(r) {
            return <div key={ r.resource_id } className="card col-xs-12"><FundraiserCard resource={r} /></div>;            
        })
        
        
        return <div>


        <div id="panel-hashtag" className="col-xs-12 card">
            <div className="card-wrap">
                <div className="row">
                    <div className="solid-bg col-sm-4">
                        #mplsart
                    </div>
                    <div className="solid-white col-sm-8">
                        If you are making art or looking at art in the Twin Cities, use the hashtag to show it off.
                    </div>
                </div>
            </div>
        </div>


            <div id="fundraising-panel" className="col-xs-12">
                <div className="row">
                    { fundraisers_rendered }
                </div>
            </div>

        </div>;

    }
});

module.exports = TempExtras