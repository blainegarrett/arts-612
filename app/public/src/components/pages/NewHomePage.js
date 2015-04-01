var React = require('react');
var PageMixin = require('./PageMixin');
//var MasonryMixin = require('react-packery-mixin');
var MasonryMixin = require('react-masonry-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);

var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');
var TempExtras = require('../temp/TempExtras');
var Separator = require('./../../utils/Layout').Separator

/* Pod types ... */
var EventModule = require('./../DataTypes/Event');
var FeaturedEventsStore = require('./../../stores/FeaturedContentStore');


var FeaturedHeroPanel = React.createClass({
    /* Homepage Specific Widget for showing featured Content in top Hero space */

    _onChange: function() {
        /* Pick up signal for when featured content changes - typically async load */
        this.setState({results: FeaturedEventsStore.getRaw()}); 
    },
    componentDidMount: function() {
        // Subscribe to changes in the featured events
        FeaturedEventsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        // Un-Subscribe to changes in the featured events
      FeaturedEventsStore.removeChangeListener(this._onChange);
    },

    getInitialState: function () {
        /* Pull data from featured store shared with homepage */
        return { results: FeaturedEventsStore.getRaw() }
    },

    render: function () {
        /* Note: This logic is basically duplicated from NavCardsContainer*/
        var rendered_marquee_events;
        var rendered_big_card;

        var total_cards = this.state.results.length;
        
        if (total_cards == 0) {
            // Not loaded yet and/or error...
            return <div className="row" id="featured-hero-area"></div>
        }

        // Pop off the big card spot since we assume *something* will always be there...
        var event_resources = $.extend(true, [], this.state.results);
        var big_card_spot_resource = event_resources.pop();
        var total_cards = event_resources.length;
        var rendered_big_card = <EventModule.Goober key="hero-event-big" resource={ big_card_spot_resource } renderer={ EventModule.FeaturedHeroRenderer } />

        var rendered_marquee_events = event_resources.map(function (resource, i) {
            return <div className="card col-sm-6"><EventModule.Goober key={ 'hero-event-' + i }resource={ resource } renderer={ EventModule.FeaturedHeroRenderer } /></div>
        });

        return <div className="row" id="featured-hero-area">
            <div className="col-sm-6">
               <div className="row featured-events-wrapper">
                    { rendered_marquee_events }
               </div>
            </div>

            <div className="featured-events-wrapper col-sm-6 large-card">{ rendered_big_card }</div>

        </div>;
    }
});

var masonryOptions = {
    transitionDuration: 0,
    gutter: 0,
    columnWidth: ".col-sm-1",
    itemSelector: '.item',    
};


var PodLoader = React.createClass({
    render: function(){
        return <div className="loader">Loading ...</div>;
    }
});


var PodMixin = {
    
};

var FeaturedEventsPod = React.createClass({
    getInitialState: function() {
        return {data: this.props.data, container: this.props.container }
    },
    render: function () {
        return <div>
        <div className="card-image">
            <a href="#"><img className="img-responsive" src="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" /></a>
            <div className="card-title"><a href="#">Material Cards</a></div>
        </div>

        <div className="card-content">
            <p>Cards for display in portfolio style material design by Google.</p>
        </div>
        <div className="card-image">
            <a href="#"><img className="img-responsive" src="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" /></a>
            <div className="card-title"><a href="#">Material Cards</a></div>
        </div>

        <div className="card-content">
            <p>Cards for display in portfolio style material design by Google.</p>
        </div>

        </div>
        
    }
});


var ImagePod = React.createClass({
    getInitialState: function() {
        console.log(this.props)

        return {
            resource: this.props.resource,
            container: this.props.container
        }
    },
  render: function () {
      
      console.log('------------------------------');
      console.log(this.state.resource);

      r = this.state.resource;
      
      return <div>assfsdfsdfsdfsdfsdfsdfs
      </div>
  }
});



var podComponentMap = {
    'Image': ImagePod,
    'FeaturedEvents': FeaturedEventsPod,
    'Event': EventModule
};

var Pod = React.createClass({
    getInitialState: function() {
        return {data: this.props.data, container: this.props.container }
    },

    render: function () {
        
        var card_grid_span = 'col-sm-3';
        var card_classes = 'card '

        if (this.state.data.featured) {
            card_classes += 'col-sm-4 col-xs-12';
        }
        else {
            card_classes += 'col-sm-3 col-xs-6';
        }

        var compnentclass = podComponentMap[this.state.data['resource_type']];
        if (!compnentclass) {
            return <div className="card col-sm-2"></div>
        }

        var pod_props = {'resource': this.state.data, renderer: compnentclass.PodRenderer };

        var pod_content = React.createElement(compnentclass.Goober, pod_props);
        return <div className={ card_classes }>{ pod_content }</div>
    }
});


//http://jsfiddle.net/mb9vJ/2/
var NewHomePage = React.createClass({

    mixins: [PageMixin, MasonryMixin('masonryContainer', masonryOptions)],

    getInitialState: function() {
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
        console.log('has more?');

        return false;
    },

    fetchpods: function() {
        $.ajax({
            url: '/api/feed',
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
                    loader={<PodLoader />}>
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
        
        /*
        $(window).on("scroll touchmove", function () {
            var featured_card = $('#home-marquee-row');
            var scroll_flag = featured_card.offset().top + featured_card.height() - 170;
            console.log(scroll_flag);

          $('#header_nav').toggleClass('show-nav', $(document).scrollTop() > scroll_flag);
        });
        */
    },
    
    componentWillUnmount: function() {
        /* Temporary solution */

        $('body').addClass('beta');
        $('body').removeClass('homepage');
    }
});

module.exports = NewHomePage;
