/* Main Renderer for Event Page */
var React = require('react');
var Reflux = require('reflux');
var moment = require('moment');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');
var EventModule = require('./../DataTypes/Event');
var EventGoober = EventModule.Goober;
var FullEventRenderer = EventModule.FullEventRenderer;
var Separator = require('../../utils/Layout').Separator;

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');
var Footer = require('../temp/Footer');


var ResourceApiService = {
    fetch: function (url) {

        console.log('ATTEMPTING TO FETCH' + url);
        var service = this;

        var promise = new Promise(function(accept, reject) {


            var req = $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                success:  function (response) {

                    if (response.status == 200) {
                        accept(response.results);
                    }
                    else {
                        console.log('fail…¬π0o9')
                        reject('Received a status of ' + response.status);
                    }
                },
                error: function (xhr, status, err) {
                    reject(err);
                }
            });
        });
        return promise;
    }

};


var EventService = {
    _resources_store: [],

    set_resource: function(resource_data) {

        /* TODO: Move this to the base class */
        this._resources_store.push(resource_data);
        return resource_data;
    },

    get_by_slug: function(slug) {

        var resource_url = '/api/events?get_by_slug=' + slug;

        var promise =  new Promise(function(accept, reject) {
            //alert('PROMISED');
            ResourceApiService.fetch(resource_url).then(function(resource_data) {
                //alert('in the Events Service accept');
                //var resource = service.set_resource(resource_data);
                //console.log(accept);
                accept(resource_data);
            }, reject);
        });
        return promise;
    }

}


/* Move to EventActions */
var EventActions = Reflux.createActions([
    "load",
    "log",
    "edit",
    "appendCtr",
]);



var EventStore = Reflux.createStore({
    listenables: [EventActions],
    _list: [],
    ctr: 0,


    init: function () {
        // Register listeners
        // this.listenTo(EventActions.load, this.fetchData); //output is a callbak for the listener of statusUpdate
        //this.listenTo(EventActions.log, this.logStore);
    },

    //get_event_by_slug : function() {
    onLoad: function(slug) {
        //alert('NOT IMPLEMENTED YET....');
        this.fetchData(slug)
    },
    onAppendCtr: function() {
        console.log('CLICKED APPEND COUNTER');
        this.ctr += 1;
        this.trigger(this._list);
    },

    logStore: function() {
        //console.log(this._list)
        //this.trigger('OTHER LOG EVENT.');
    },
    fetchData: function (slug) {

        //alert('taco');

        var promise = EventService.get_by_slug(slug).then(function(event) {
            alert('We have new data!!!');

            this._list.push(event);
            this.trigger(event);

        }.bind(this), function(err) {
            //alert(err);
            //this.setState({content_not_found:true, content_loaded:true})
        }.bind(this)
        );


    }
});


var EventPage = React.createClass({
    mixins: [PageMixin, Reflux.ListenerMixin],

    default_meta: {
        'title': 'View Event',
        'description': 'Events in Minneapolis and St. Paul'
    },


    getInitialState: function () {
        var slug = this.context.router.getCurrentParams().slug;

        console.log(slug);
        return {
            //resource_url: '/api/events?get_by_slug=' + slug,
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

    onLoad: function(payload) {
        console.log(payload);

        this.setState({data:payload, content_loaded:true, results:payload})
    },

    pageDidMount: function () {

        this.setMeta();

        // Subscribe to Desired Actions
        this.listenTo(EventStore, this.onLoad);

        // Trigger the load action
        var slug = this.context.router.getCurrentParams().slug;
        EventActions.load(slug);


    },

    componentWillReceiveProps: function() {
        var slug = this.context.router.getCurrentParams().slug;
        EventActions.load(slug);
        return true;
    },
    render: function() {
        //return (<div>{this.context.router.getCurrentParams().slug} </div>)


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

        var slug = this.context.router.getCurrentParams().slug;

        return <div id="HomePageWrapper">
            <div className="row">
                <div className="col-md-6">

                    <a href="#" onClick={ function() { EventActions.appendCtr(); }}>log</a>
                    <a href="#" onClick={ function() { EventActions.load(slug); }}>reload from store</a>

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
