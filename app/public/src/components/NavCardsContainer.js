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

        return <div className="item jive-card col-sm-2">
            <div className="jive-card-image">
                <a href="#" style={ styles } id={id} className={classes}>
                    <div className="jive-card-title">
                        <div className="date">Sat, Mar 1st</div>
                    </div>
                </a>
            </div>
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
    		    <CoolCardSet />

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