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

var masonryOptions = {
    transitionDuration: 0,
    gutter: 0,
    columnWidth: ".col-sm-1",
    itemSelector: '.item',
    
};

var pod_data = [
    {'colspan': 8, pos: 1, podClass: 'FeaturedEvents', 'img_url': "https://scontent-a-sea.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/p526x296/524150_10154709828460357_7089693634088703368_n.jpg?oh=20f20c793fe7c11205992101c883f787&oe=54DE2A7F"},
    {'colspan': 4, pos: 2, podClass: 'Image', 'img_url': "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xaf1/v/t1.0-9/10152433_10154107872845357_9126802419535311414_n.jpg?oh=1ff0dd0512ff5d89f45378c3108de5e9&oe=55166AF7&__gda__=1427244355_579859ab5a0384fddb8afc40e0313d47"},
    {'colspan': 2, pos: 3, podClass: 'Image', 'img_url': "http://www.bockleygallery.com/exhibit_temporary/images/exhibition_home.jpg"},
    {'colspan': 2, pos: 4, podClass: 'Image', 'img_url': "https://scontent-b-sea.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/10175070_10154107871190357_2989812135025342919_n.jpg?oh=504a757d4312cb620de88750b1ffd7dd&oe=551D1B47"},
    {'colspan': 4, pos: 5, podClass: 'Image', 'img_url': "https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10489643_10154347000515357_9062012805293187042_n.jpg?oh=7f479814a25b1eba333d8069f7ecb200&oe=54D1EA78&__gda__=1424270446_9bad1ba970d75506abc56160f3628a49"},
    {'colspan': 2, pos: 6, podClass: 'Image', 'img_url': "https://scontent-b-sea.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/10175070_10154107871190357_2989812135025342919_n.jpg?oh=504a757d4312cb620de88750b1ffd7dd&oe=551D1B47"},
    {'colspan': 2, pos: 7, podClass: 'Image', 'img_url': ""},
    {'colspan': 4, pos: 8, podClass: 'Image', 'img_url': "https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10489643_10154347000515357_9062012805293187042_n.jpg?oh=7f479814a25b1eba333d8069f7ecb200&oe=54D1EA78&__gda__=1424270446_9bad1ba970d75506abc56160f3628a49"}
];

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
        return {data: this.props.data, container: this.props.container }
    },
  render: function () {
      return <div>
      <div className="card-image">
          <a href="#"><img className="img-responsive" src={this.state.data.img_url} /></a>
          <div className="card-title"><a href="#">Material Cards</a></div>
      </div>

      <div className="card-content">
          <p>Cards for display in portfolio style material design by Google.</p>
      </div>
      </div>
  }
});



var podComponentMap = {
    'Image': ImagePod,
    'FeaturedEvents': FeaturedEventsPod
};

var Pod = React.createClass({
    getInitialState: function() {
        return {data: this.props.data, container: this.props.container }
    },
    addmore : function() {
        this.state.container.addmore();
    },


    render: function () {

        var pod_content = React.createElement(podComponentMap[this.state.data.podClass], this.state);

        return <div className={'item col-sm-' + this.state.data.colspan}>

          <div className="card">
              { pod_content }
          </div>

    	</div>
    }
});

var HomePods = React.createClass({
    mixins: [MasonryMixin('masonryContainer', masonryOptions)],

    getInitialState: function() {
        return {pod_data: pod_data}
    },

    addmore : function() {
        

        pod = {'colspan': 2, 'img_url': "https://scontent-a-sea.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/p526x296/524150_10154709828460357_7089693634088703368_n.jpg?oh=20f20c793fe7c11205992101c883f787&oe=54DE2A7F"};

        pod_data = this.state.pod_data;
        pod_data = pod_data.concat([pod]);
        this.setState({pod_data: pod_data});
    },

    render: function(){
        console.log('rerendering homepods...');

        var container = this;

        var pods = this.state.pod_data.map(function(pod_data){
            return <Pod data={pod_data} container={container} />;
        });

        return <div ref="masonryContainer">
            { pods }
            <div className="item col-sm-1"></div>
            </div>;
    }
});

//http://jsfiddle.net/mb9vJ/2/
var NewHomePage = React.createClass({
    mixins: [PageMixin, MasonryMixin('masonryContainer', masonryOptions)],    
    getInitialState: function() {
        return {
            pod_data: pod_data,
            hasMore: true
        }
    },
    default_meta: {
        'title': 'mplsart.com | Returning Spring 2015',
        'description': 'The Very Best Events and Gallery Listings for Minneapolis and St. Paul',
        'image': 'http://mplsart.com/static/themes/v0/mplsart_fbimg.jpg'
    },

    hasMore: function (){
        return false;
    },

    loadFunc: function (page){
        setTimeout(function () {
            var pod = {'colspan': 2, 'img_url': "https://scontent-a-sea.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/p526x296/524150_10154709828460357_7089693634088703368_n.jpg?oh=20f20c793fe7c11205992101c883f787&oe=54DE2A7F"};
          this.setState({
            pod_data: this.state.pod_data.concat(pod_data),
            hasMore: (page < 15)
          });
        }.bind(this), 1000);
    },
    render: function() {
        var pods = [];
        var container = this;

        var pods = this.state.pod_data.map(function(pod_data){
            return <Pod data={pod_data} container={container} />;
        });

        return <div id="HomePageWrapper">
            <div className="row">
            
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadFunc}
                    hasMore={this.hasMore}
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
        
        $(window).on("scroll touchmove", function () {
            var featured_card = $('.card:first');
            var scroll_flag = featured_card.offset().top + featured_card.height() - 170;
            console.log(scroll_flag);

          $('#header_nav').toggleClass('show-nav', $(document).scrollTop() > scroll_flag);
        });
    }
});
module.exports = NewHomePage;
