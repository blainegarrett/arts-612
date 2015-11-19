/* Main Renderer for Event Page */
var React = require('react');
var PageMixin = require('./PageMixin');
var EventModule = require('./../DataTypes/Event');
var EventGoober = EventModule.Goober;
var FullEventRenderer = EventModule.FullEventRenderer;
var Separator = require('../../utils/Layout').Separator;

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');
var Footer = require('../temp/Footer');

var EventPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'View Event',
        'description': 'Events in Minneapolis and St. Paul'
    },

    getInitialState: function () {
        return {
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
            title: resource.name,
            description: resource.summary
        }

        if (resource.primary_image_resource) {
            // TODO: Do better error checking...
            this.default_meta['image'] = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        this.setMeta();
    },

    requestPageContent: function (slug) {

        var rc = this;

        this.setMeta();

        var url = '/api/events?get_by_slug=' + slug

        $.ajax({
            url: url,
            dataType: 'json',
            success:  function (data) {
                this.setState({data:data, content_loaded:true, results:data.results});
                rc.set_meta_for_resource();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                this.setState({content_not_found:true, content_loaded:true})
            }.bind(this)

        });
    },
    componentWillReceiveProps: function (nextProps) {
        /* TODO: This is a lame hack to avoid a huge re-write before Redux */

        this.requestPageContent(nextProps.params.slug);
        return true;
    },
    pageDidMount: function () {
        this.requestPageContent(this.props.params.slug);
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

        return <div id="HomePageWrapper">
            <div className="row">
                <div className="col-md-6">
                    { rendered_content }
                    <Separator />
                </div>

                <div className="col-md-3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                <div className="col-md-3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
            </div>

            <Footer />
        </div>;

    }
});
module.exports = EventPage;
