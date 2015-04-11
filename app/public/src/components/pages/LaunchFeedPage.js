var React = require('react');
var moment = require('moment');
var PageMixin = require('./PageMixin');
//var MasonryMixin = require('react-packery-mixin');
var MasonryMixin = require('react-masonry-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);
var FeaturedHeroPanel = require('../FeaturedHeroPanel');
var Footer = require('../temp/Footer');
var Separator = require('./../../utils/Layout').Separator;

/* Pod types ... */
var EventModule = require('./../DataTypes/Event');
var InstagramModule = require('./../DataTypes/Instagram');

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
            container: this.props.container,
            pos: this.props.pos
        }
    },

    render: function () {

        var card_classes = 'card '
        card_classes += 'col-sm-2';

        return <div className={ card_classes }>
            <InstagramModule.Goober resource={this.state.data} renderer={ InstagramModule.PodRenderer } />
        </div>
    }
});


//http://jsfiddle.net/mb9vJ/2/
var NewHomePage = React.createClass({

    mixins: [PageMixin],

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
        
        resource_url = '/api/instagram'

        $.ajax({
            url: resource_url,
            dataType: 'json',
            success:  function (data) {
                /* Have the store do this... */

                console.log(data.results);
                setInterval(cycleImages, 4000);

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

    render: function() {
        var pods = [];
        var container = this;


        shuffle(this.state.pod_data);        

        var pods = this.state.pod_data.map(function (pod_data, i) {
            return <Pod key={'pod-' + i} pos={i} data={pod_data} container={container} />;
        });

        return <div id="HomePageWrapper">

            <div className="row">

                <div className="col-xs-8 cycler-container">
                    
                    <div className="active">
                        <a href="https://instagram.com/p/1HGsFgQukj/" target="_new" >
                            <img className="img-responsive" src="https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11142156_427086207452231_856057832_n.jpg" />
                        </a>
                    </div>


                    <div>
                        <a href="https://instagram.com/p/1HGsFgQukj/" target="_new" >
                            <img className="img-responsive" src="https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11117109_1427277530900876_1135374857_n.jpg" />
                        </a>
                    </div>
                    
                    
                    <div>
                        <a href="https://instagram.com/p/1HGsFgQukj/" target="_new" >
                            <img className="img-responsive" src="https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11084785_1619157998299896_494872160_n.jpg" />
                        </a>
                    </div>
                
                
                </div>




            </div>

        </div>;
    },

    componentDidMount: function () {

        console.log('asdf afksdf;ksdfsdkl; ');
        setTimeout(this.fetchpods, 1000);
        
        this.setMeta();
        
        $('body').removeClass('beta');
        $('body').addClass('homepage');

        console.log('asdf afksdf;ksdfsdkl; ');
        
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







function cycleImages() {
    
    console.log('eh?');
    var $active = ($('.cycler-container .active').length > 0) ? $('.cycler-container .active') : $('.cycler-container div:first');
    var $next = ($active.next().length > 0) ? $active.next() : $('.cycler-container div:first');



    $('img', $next).css('z-index', 2);//move the next image up the pile
    $('img', $active).fadeOut(3000, function() {//fade out the top image
        $('img', $active).css('z-index', 1);
        $('img', $active).show();
        $active.removeClass('active');//reset the z-index and unhide the image

        $('img', $next).css('z-index', 3);
        $next.addClass('active');//make the next image the top one
    });
};


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}






module.exports = NewHomePage;
