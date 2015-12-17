var React = require('react');
var moment = require('moment');
var PageMixin = require('./PageMixin');
//var MasonryMixin = require('react-packery-mixin');
var MasonryMixin = require('react-masonry-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);
var FeaturedHeroPanel = require('../FeaturedHeroPanel');
var Footer = require('../temp/Footer');
var Separator = require('./../../utils/Layout').Separator;
var TONIGHT_END_DATE_UTC = require('./../../constants').TONIGHT_END_DATE_UTC;

/* Pod types ... */
var EventModule = require('./../DataTypes/Event');
var AdvertModule = require('./../DataTypes/Advert');

var podComponentMap = {
    'Event': EventModule,
    'Advert': AdvertModule
};

var masonryOptions = {
    transitionDuration: 0,
    gutter: 0,
    columnWidth: ".spacer",
    itemSelector: '.col'
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
        var card_classes = 'col ';

        if (this.state.data.featured) {
            card_classes += 's12 m6';
        }
        else {
            card_classes += 's12 m3';
        }

        var componentClass = podComponentMap[this.state.data['resource_type']];
        if (!componentClass) {
            return <div className="col s2"></div>
        }

        var pod_props = {'resource': this.state.data, renderer: componentClass.PodRenderer };

        var pod_content = React.createElement(componentClass.Goober, pod_props);
        return (
            <div className={ card_classes }>
                <div className="card hoverable">
                    { pod_content }
                </div>
            </div>
        );
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

        var target_end_date = TONIGHT_END_DATE_UTC.format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        var resource_url =  '/api/events/upcoming?sort=start&category=performance,reception,sale&end=' + target_end_date;
        var resource_url = '/static/pods.json';

        $.ajax({
            url: resource_url,
            dataType: 'json',
            success:  function (data) {
                /* Have the store do this... */

                var advert_resource = AdvertModule.get_random();
                if (advert_resource) {
                    data.results.splice(2, 0, advert_resource);
                }

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

        var rc = this;
        return <div id="HomePageWrapper">

            <FeaturedHeroPanel />
            <Separator />

            {  /* <a href="#" onClick={function() { rc.masonry.layout(); return false; }}>recalc</a>  */ }

            <div className="row">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadFunc}
                    hasMore={this.state.hasMore}
                    loader={<WaterfallLoadingWidget />}>
                        <div ref="masonryContainer">
                            { pods }
                            <div className="spacer col s1">
                                <div className="card"></div>
                            </div>
                        </div>
                    </InfiniteScroll>
            </div>

            <Footer />
        </div>;
    },

    pageDidMount: function () {
        // Initialize Page

        this.setMeta();

        $('body').removeClass('beta');
        $('body').addClass('homepage');
    },

    pageWillUnmount: function() {
        /* Temporary solution */

        $('body').addClass('beta');
        $('body').removeClass('homepage');
    }
});

module.exports = NewHomePage;
