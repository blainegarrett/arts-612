var React = require('react');
var moment = require('moment');
var PageMixin = require('./PageMixin');
var MasonryMixin = require('react-packery-mixin');
//var MasonryMixin = require('react-masonry-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);
var FeaturedHeroPanel = require('../FeaturedHeroPanel');
var Footer = require('../temp/Footer');
var Separator = require('./../../utils/Layout').Separator;

/* Pod types ... */
var EventModule = require('./../DataTypes/Event');
var podComponentMap = {
    'Event': EventModule
};

var masonryOptions = {
    transitionDuration: 0,
    gutter: 0,
    columnWidth: ".col-sm-1",
    itemSelector: '.card'
};


var WaterfallLoadingWidget = React.createClass({
    render: function () {
        return <div className="initial-loading-spinner">
            <i className="fa fa-spinner fa-pulse"></i>
        </div>;
    }
});


var Pod = React.createClass({
    getInitialState: function () {
        return {
            data: this.props.data,
            container: this.props.container
        }
    },

    render: function () {

        var card_grid_span = 'col-sm-3';
        var card_classes = 'card '

        if (this.state.data.featured) {
            card_classes += 'col-sm-6 col-xs-12';
        }
        else {
            card_classes += 'col-sm-3 col-xs-12';
        }

        var componentClass = podComponentMap[this.state.data['resource_type']];
        if (!componentClass) {
            return <div className="card col-sm-2"></div>
        }

        var pod_props = {'resource': this.state.data, renderer: componentClass.PodRenderer };

        var pod_content = React.createElement(componentClass.Goober, pod_props);
        return <div className={ card_classes }>{ pod_content }</div>
    }
});


//http://jsfiddle.net/mb9vJ/2/
var NewHomePage = React.createClass({

    mixins: [PageMixin, MasonryMixin('masonryContainer', masonryOptions)],

    getInitialState: function () {
        return {
            pod_data: [],
            hasMore: true
        }
    },

    default_meta: {
        'title': 'MPLSART.COM | Make a Scene',
        'description': 'Find the best art events in Minneapolis and St. Paul',
        'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
    },

    hasMore: function () {
        //console.log('has more?');
        return true;
        return false;
    },

    fetchpods: function() {

        // For now we're just loading the upcoming events...
        // 3AM CST "today"

        var date = moment().hour(9).minute(0).second(0);
        date = moment.utc(date);
        var target_end_date = date.format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        var resource_url =  '/api/events/upcoming?sort=start&category=performance,reception,sale&end=' + target_end_date;

        $.ajax({
            url: resource_url,
            dataType: 'json',
            success:  function (data) {
                /* Have the store do this... */

                this.setState({
                    pod_data: this.state.pod_data.concat(data.results),
                    hasMore: false
                });                

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
        });
    },

    loadFunc: function (page) {
        setTimeout(this.fetchpods, 1000);
    },

    render: function() {
        var pods = [];
        var container = this;

        var pods = this.state.pod_data.map(function (pod_data, i) {
            return <Pod key={'pod-' + i} data={pod_data} container={container} />;
        });

        return <div id="HomePageWrapper">

            <FeaturedHeroPanel />
            <Separator />

            <div className="row">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadFunc}
                    hasMore={this.state.hasMore}
                    loader={<WaterfallLoadingWidget />}>
                        <div ref="masonryContainer">
                            { pods }
                            <div className="item col-sm-1"></div>
                        </div>
                    </InfiniteScroll>
            </div>

            <Footer />
        </div>;
    },

    componentDidMount: function () {
        
        this.setMeta();
        
        $('body').removeClass('beta');
        $('body').addClass('homepage');
    },
    
    componentWillUnmount: function() {
        /* Temporary solution */

        $('body').addClass('beta');
        $('body').removeClass('homepage');
    }
});

module.exports = NewHomePage;
