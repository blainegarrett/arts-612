var React = require('react');


var CoolCard = React.createClass({
    render: function () {
        var styles = {
            'background' : 'url(' +  this.props.url + ');',
            'background-size': 'cover;',
            'background-position': '50% 50%;'
        };

        var id = "carousel-selector-" + this.props.pos;
        var classes = '';
        if  (this.props.pos == 0) {
            classes = 'active';
        }

        return <div className="item col-sm-3">
            <a href="#" style={ styles } id={id} className={classes}>
                <span>01/03</span>
                <div></div>
            </a>
        </div>;
    }
});

var CoolCardSet = React.createClass({
    render: function () {

        return <div className="row-shim">
            <CoolCard pos="0" url="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" />
            <CoolCard pos="1" url="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" />
            <CoolCard pos="2" url="http://commondatastorage.googleapis.com/dim-media/artwork/sized/as_we_leave.jpg" />
            <CoolCard pos="3" url="http://commondatastorage.googleapis.com/dim-media/artwork/sized/cone.jpg" />
        </div>;
        
    }
});

var CoolSideCard = React.createClass({
    render: function () {
        var styles = {
            'background' : 'url(http://placehold.it/500x500);',
            'background-size': 'cover;',
            'background-position': '50% 50%;'
        };
        
        return <div className="card">
                  <a href="#" style={ styles }>
                    <span>derp</span>
                  </a>
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