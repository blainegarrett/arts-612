var React = require('react');
var CoolCardSet = require('./NavCardsContainer').CoolCardSet;


var CarouselSliderPanel = React.createClass({
    render: function () {
        var style = {
            'background' : 'url(' +  this.props.url + ');',
            'background-size': 'cover;',
            'background-position-y': '50%;',
            'height': '325px',
            'width': '100%'
        };

        var classNames = 'item';
        if (this.props.pos == 0) {
            classNames = classNames += ' active';
        }

        return <div className={classNames} data-slide-number={ this.props.pos}>
            <div style={ style }></div>
        </div>
    }
});

var HomePageCarousel = React.createClass({
    
    componentDidMount: function () {
        
        $('#myCarousel').carousel({
            interval: 5000
        });


        //Handles the carousel thumbnails
        $('#slider-thumbs [id^=carousel-selector-]').click( function(){
            var id = this.id.substr(this.id.lastIndexOf("-") + 1);
            var id = parseInt(id);
            $('#myCarousel').carousel(id);
        });
    },
    render: function () {
        return <div>

        <div className="row">



                    <div className="col-sm-12" id="carousel-bounding-box">
                        <div className="carousel slide" id="myCarousel">


                            <div className="carousel-inner">

                                <CarouselSliderPanel pos="0" url="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" />
                                <CarouselSliderPanel pos="1" url="http://www.bockleygallery.com/exhibit_temporary/images/exhibition_home.jpg" />
                                <CarouselSliderPanel pos="2" url="http://commondatastorage.googleapis.com/dim-media/artwork/sized/as_we_leave.jpg" />
                                <CarouselSliderPanel pos="3" url="http://commondatastorage.googleapis.com/dim-media/artwork/sized/48e8c04fd31eb62fe66ca77cec3ee0cf.jpg" />

                            </div>

                            <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                                <span className="glyphicon glyphicon-chevron-left"></span>                                       
                            </a>
                            <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                                <span className="glyphicon glyphicon-chevron-right"></span>                                       
                            </a>


                        </div>
                    </div>

                </div>


        <div className="row hidden-xs" id="slider-thumbs">

            <CoolCardSet />
               
        </div>
    
    
    </div>


    }
});

module.exports = HomePageCarousel;