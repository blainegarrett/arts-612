/* Main Renderer for Event Page */
var React = require('react');
var moment = require('moment');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');
var EventModule = require('./../DataTypes/Event')
var EventGoober = EventModule.Goober
var FullEventRenderer = EventModule.FullEventRenderer
var Separator = require('../../utils/Layout').Separator

var EventPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'View Event',
        'description': 'Events in Minneapolis and St. Paul'
    },
    getInitialState: function () {
        console.log(this.props);

        return {
            resource_url: '/api/events?get_by_slug=' + this.props.slug,
            content_loaded: false,
            content_not_found: false,
            results: null,
            data: null
        };

    },

    set_meta_for_resource: function() {
        // Set the Page Meta for this specific post

        var resource = this.state.results;

        this.default_meta =  {
            title: resource.title,
            description: resource.summary
        }

        if (resource.primary_image_resource) {
            // TODO: Do better error checking...
            this.default_meta['image'] = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        this.setMeta();
    },

    componentDidMount: function () {
        var rc = this;

        this.setMeta();


        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                this.setState({data:data, content_loaded:true, results:data.results});
                rc.set_meta_for_resource();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
                this.setState({content_not_found:true, content_loaded:true})
            }.bind(this)
            
        });
    },

    render: function() {

        var rendered_content;

        if (this.state.content_not_found) {
            rendered_content = (<div>
                <h2>Event Not Found</h2>
                <p>We were unable to find the requested event. </p>
            </div>);
        }
        else if (this.state.results != undefined) {
            resource = this.state.results;

            rendered_content = <EventGoober key={ resource.resource_id } resource={ resource } renderer={ FullEventRenderer } />
        }
        else {
            rendered_content = <EventGoober resource={ null } renderer={ FullEventRenderer } />
        }

        return <div>
            <div className="row">
                { rendered_content }
            </div>
            
            <Separator />

            </div>
            ;

    }
});
module.exports = EventPage;
