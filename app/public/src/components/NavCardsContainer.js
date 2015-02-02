var React = require('react');


var CoolCard = React.createClass({
    render: function () {
        var styles = {
            'background' : 'url(' +  this.props.url + ');',
            'background-size': 'cover;',
            'background-position': '50% 50%;'
        };

        var id = "carousel-selector-" + this.props.pos;

        return <div className="item col-sm-3">
            <a href="#" style={ styles } id={id}>
                <span>01/03</span>
                <div>Totally xxx</div>
            </a>
        </div>;
    }
});
var CoolCardSet = React.createClass({
    render: function () {

        return <div className="row">
            <CoolCard pos="0" url="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" />
            <CoolCard pos="1" url="http://www.bockleygallery.com/exhibit_temporary/images/exhibition_home.jpg" />
            <CoolCard pos="2" url="http://commondatastorage.googleapis.com/dim-media/artwork/sized/as_we_leave.jpg" />
            <CoolCard pos="3" url="http://commondatastorage.googleapis.com/dim-media/artwork/sized/48e8c04fd31eb62fe66ca77cec3ee0cf.jpg" />
        </div>;
        
    }
});

var CoolSideCard = React.createClass({
    render: function () {
        return <div className="card">
        	<div className="card-image">
                  <a href="#">
                    <span>derp</span>
                  </a>
              </div>
        </div>        
    }
});


var NavCardsContainer = React.createClass({
    render: function () {
        return <div className="container">
    	    <div className="row">
    		    <div className="col-sm-8">
    		        <CoolCardSet />
    		    </div>

    		    <div className="col-sm-4 sidecard">
    		        <CoolSideCard />
    		    </div>
    		</div>
      	</div>
    }
});

module.exports = {
        NavCardsContainer: NavCardsContainer,
        CoolCardSet: CoolCardSet
}