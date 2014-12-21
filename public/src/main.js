/* Main Entry Point For App */
/*
var moment = require('moment');
var coolthing = require('./coolthing.js');
var React = require('react');

console.log('jive');
console.log(coolthing.derp.doit());
*/

// React is global
var MasonryMixin = require('react-masonry-mixin');

var Hello = React.createClass({

  render: function() {
    return <div>Oh hey. Hello, {this.props.name}!</div>
  }
});


var pod_data = [
    {'colspan': 6, 'img_url': "https://scontent-a-sea.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/p526x296/524150_10154709828460357_7089693634088703368_n.jpg?oh=20f20c793fe7c11205992101c883f787&oe=54DE2A7F"},
    {'colspan': 6, 'img_url': "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xaf1/v/t1.0-9/10152433_10154107872845357_9126802419535311414_n.jpg?oh=1ff0dd0512ff5d89f45378c3108de5e9&oe=55166AF7&__gda__=1427244355_579859ab5a0384fddb8afc40e0313d47"},
    {'colspan': 4, 'img_url': "https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10489643_10154347000515357_9062012805293187042_n.jpg?oh=7f479814a25b1eba333d8069f7ecb200&oe=54D1EA78&__gda__=1424270446_9bad1ba970d75506abc56160f3628a49"},
    {'colspan': 4, 'img_url': "https://scontent-b-sea.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/10175070_10154107871190357_2989812135025342919_n.jpg?oh=504a757d4312cb620de88750b1ffd7dd&oe=551D1B47"},
];

var Pod = React.createClass({
    getInitialState: function() {
        console.log(this.props.container);

        return {data: this.props.data, container: this.props.container }
    },
    addmore : function() {
        this.state.container.addmore();
    },
    render: function() {
        var style = {'width': '100%', 'minHeight': '200px'};

        return <div className={'item col-sm-' + this.state.data.colspan}>
    		<div className="item-container">
    			<h3 id="download-sass">4. Sass <button onClick={this.addmore}>Add More</button></h3>
                <img style={style} src="http://commondatastorage.googleapis.com/dim-media/artwork/sized/dip-trip-flip-synesthesia.jpg" />
    		</div>
    	</div>
    }
});





var masonryOptions = {
    transitionDuration: 0,
    gutter: 0,
    columnWidth: ".col-sm-1",
    itemSelector: '.item'
};
 
 /*
module.exports = React.createClass({
    displayName: 'SomeComponent',
 
    mixins: [MasonryMixin(masonryOptions)],
 
    render: function () {
        var childElements = this.props.elements.map(function(element){
           return (
                <div className="someclass">
                    {element.name}
                </div>
            );
        });
        
        return (
            <div ref="masonryContainer">
                {childElements}
            </div>
        );
    }
});
*/


var HomePods = React.createClass({
    mixins: [MasonryMixin('masonryContainer', masonryOptions)],

    getInitialState: function() {
        return {pod_data: pod_data}
    },

    addmore : function() {
        //console.log(this.masonry);
        

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

//React.render(HomePods, document.getElementById('xcontainer'));
React.render(
  <HomePods  />,
  document.getElementById('xcontainer')
);

module.exports = HomePods

React.render(
  <Hello name="World" />,
  document.getElementById('hello')
);

/*
var container = document.querySelector('#xcontainer');
var msnry = new Masonry( container, {
  gutter: 0,
  columnWidth: ".col-sm-1",
  itemSelector: '.item'
});
*/
/*
function bloop() {
    var elements = $('<div class="item col-sm-6"><div class="item-container"><h3 id="download-sass">6. Sass</h3><img class="img-responsive" src="https://scontent-a-sea.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/10300311_10154106501640357_3849444375050459052_n.jpg?oh=2a43d33dc6614d166e1ad6dec2c1c0b1&oe=551F49AA" /></div></div>');
    msnry.addItems( elements )
}

module.exports = bloop;
*/