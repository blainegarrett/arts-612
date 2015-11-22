var React = require('react');
var PageMixin = require('./PageMixin');
var GoogleMapsLoader = require('google-maps');
var PageLink = require('../../linking').PageLink;
var ShortcodeParser = require("meta-shortcodes");
var ReactDOMServer = require("react-dom/server");


function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


var RedBold = React.createClass({
    render: function (){
        return (<b style={{color: 'red'}}>{ this.props.children }</b>)
    }
});

var input = "[bold strong=true]Sample [test]shortcode content [nested multiply=2 2 4/] is upper[/test] case![/bold]";
var input = "<p>In the near future or not so distant past, the world is in ruins from a long overdue&nbsp;apocalypse. Curiously, most of the remaining survivors consist of a gang of children who have a penchant for wearing Victorian era clothing. These kids scrounge to survive in the ghost that the Earth left behind, where mutant animals roam, buildings appear to be organic and alive, and all other material culture is shattered and strewn like the donations left overnight at a Salvation Army.&nbsp;&nbsp;&nbsp;<br /><br />&nbsp;<br /><br />[caption id=&quot;attachment_1086&quot; align=&quot;aligncenter&quot; width=&quot;521&quot; caption=&quot;The Briny Deep&quot;]<a href=\"http://www.mplsart.com/written/exhibition-reviews/the-unknown-of-unknowns-of-alex-kuno/the-briny-deep-detail/\"><img alt=\"\" class=\"size-medium wp-image-1086\" height=\"694\" src=\"http://cdn.mplsart.com/written/wp-content/uploads/2012/03/The-Briny-Deep-Detail-521x694.jpg\" title=\"The Briny Deep (Detail)\" width=\"521\" /></a>[/caption]<br /><br />This grotesque&nbsp;but charming scenario is not unlike the world that <strong>Alex Kuno</strong>&nbsp;explores in <strong><em>Miscreants of Tiny Town</em></strong>, an expansive series of paintings that he has been exploring in recent years. The latest batch of this work is currently on view at <strong><em>Cult Status Gallery </em></strong>in South Minneapolis.<br />"
var parser = ShortcodeParser({openPattern: '\\[!', closePattern: '\\!]' });
var parser = ShortcodeParser();

parser.add("bold", function(opts, content) {
    console.log(opts);

    if (opts["strong"]) {
        return "<strong>" + content + "</strong>"
    }

    return "<b>" + content + "</b>"
});


handler = function () {
    alert('sdfsd');
}

parser.add("caption", function(opts, content){

    console.log(opts);

    var styles = {};
    var classes = 'wp-caption';

    styles["width"] = opts["width"] + 'px';
    classes += " " + opts["align"];

    content = content + ReactDOMServer.renderToStaticMarkup(<figcaption className="wp-caption-text">{ opts["caption"] }<a onClick={ handler }>ssdf</a></figcaption>)

    return React.createElement('div', {}, content);
    //return ReactDOMServer.renderToStaticMarkup({React.createElement('div', {}, content));
    //return (<div style={styles} className={ classes } dangerouslySetInnerHTML={{__html: content }} />);
    //return ReactDOMServer.renderToString((<div style={styles} className={ classes } dangerouslySetInnerHTML={{__html: content }} />))
    //return ReactDOMServer.renderToStaticMarkup (<div style={styles} className={ classes } dangerouslySetInnerHTML={{__html: content }} />);
});

parser.add("test", function(opts, content){
    return ReactDOMServer.renderToStaticMarkup (<RedBold>{ content.toUpperCase() }</RedBold>);
});

parser.add("nested", function(opts, content){

    if(!opts.multiply) return "Missing multiply attribute!";

    var out = [];

    for(var i = 0; i < opts.length; i++)
        out.push(opts[i] * parseFloat(opts.multiply));

    return out.join(" ");

});




var Gallery404Page = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Gallery Not Found',
        'description': 'The Gallery You Are Looking for Could Not Be Found.'
    },
    pageDidMount: function () {
        this.setMeta();
    },
    render: function() {
        return <div>
        <h2>Gallery not found...</h2>

        <br /><br/>
        <PageLink to="/galleries">Return to Galleries Listing</PageLink>
        </div>
    }
});


var MapComponent = React.createClass({
    getInitialState: function () {
        return {
            gallery: this.props.gallery,
            geo: this.props.gallery.geo
        }
    },

    componentDidMount: function () {
        var c = this;

        GoogleMapsLoader.KEY = 'AIzaSyB4MkGj6-uAll42KklXe3QISTIbhRoJ1Ng';
        GoogleMapsLoader.load(function(google) {

            var map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: { lat: c.state.geo.lat, lng: c.state.geo.lon},
                zoom: 17
            });

            var marker = new google.maps.Marker({
                  position: { lat: c.state.geo.lat, lng: c.state.geo.lon},
                  map: map,
                  title: 'Uluru (Ayers Rock)'
              });

              var infowindow = new google.maps.InfoWindow({
                   content: '<div id="content">'+
                         '<div id="siteNotice">'+
                         '</div>'+
                         '<h1 id="firstHeading" class="firstHeading">' + c.state.gallery.name + '</h1>'+
                         '<div id="bodyContent">'+
                         '<p>' + c.state.gallery.summary +  '</p>'+
                         //'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                         //'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                         //'(last visited June 22, 2009).</p>'+
                         '</div>'+
                         '</div>'
               });
              infowindow.open(map, marker);

        });
    },
    render: function () {
        return <div id="map-canvas" className="map-large"></div>
    }
});


var GalleryViewPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Galleries',
        'description': 'Galleries in Minneapolis and St. Paul'
    },
    getInitialState: function () {
        return {
            gallery: null,
            slug: this.props.slug,
            not_found: false,
            resource_url: '/api/galleries?get_by_slug=' + this.props.params.slug

        }
    },

    //componentWillReceiveProps: function (nextProps) {
    // We will want to implement this - perhaps at the PageMixin level...å
    //},

    pageDidMount: function () {

        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {

                /* Have the store do this... */

                /* TODO: Add image and description */
                this.default_meta = {
                    title: data.results.name,
                    description: data.results.summary
                }


                this.setMeta();
                this.setState({gallery: data.results});


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());

                this.default_meta = {
                    title: 'gallery not found',
                    description: 'This gallery could not be found'
                }

                this.setMeta();
                this.setState({not_found: true, gallery:true});

            }.bind(this)

        });
    },

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },

    render: function() {

        // If no data loaded
        if (!(this.state.gallery) == true) {
            // TODO: Render a shell of what the page will look like
            return <div>loading gallery...</div>
        }

        if (this.state.not_found) {
            return <Gallery404Page slug={ this.state.slug } />
        }

        // If gallery not found by slug
        var g = this.state.gallery;

        var image = null;
        var image_url = null;

        if (g.primary_image_resource) {
            image_url = g.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }

        return <div className="row">
            <div className="col-md-6">

            { image }
            <br />

                <div className="row">
                    <div className="col-md-4">
                        <img src="http://placehold.it/350x350" className="img-responsive" />
                    </div>
                    <div className="col-md-8">




                        <p>Type: { g.category }</p>


                        <p>{ g.content }</p>

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <br />
                        <MapComponent gallery={g} />
                        <pre>{ JSON.stringify(g) }</pre>
                    </div>
                </div>
            </div>
            <div className="col-md-6">

                <h2>{g.name}</h2>
                <p>{ g.address } { g.address2 } -  { g.city }</p>

                <p>{ g.summary }</p>

                <h3>Upcoming Events</h3>
                <ul>
                    <li>Event 1</li>
                    <li>Event 2</li>
                </ul>
                ..Previous Events

                <h3>Hours</h3>
                <p>
                  From 10:00 to 18:00
                </p>
                <h3>Contact</h3>
                <p>Phone: { g.phone }</p>
                <p>Email: { g.email }</p>
                <p>Website: { g.website }</p>


            </div>
        </div>;

    }
});




var GalleryIndexPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Galleries',
        'description': 'Galleries in Minneapolis and St. Paul'
    },
    getInitialState: function () {
        return {
            galleries: [],
            resource_url: '/api/galleries'
        }
    },
    pageDidMount: function () {
        this.setMeta();

        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                /* Have the store do this... */
                this.setState({galleries:data});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)

        });
    },

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },

    render: function() {

        var p = new DOMParser();
        var doc = p.parseFromString(decodeHtml(input), "text/html");

        var child = doc.body.childNodes;


        return (
            <div>
                <pre>{ parser.parse(decodeHtml(input)) }</pre>
                <div>{ React.createElement('div', {}, parser.parse(decodeHtml(input))) }</div>
        </div>);

        var galleries = []
        var rc = this;

        if (this.state.galleries.results != undefined) {
            galleries = this.state.galleries.results.map(function (g) {
                return <li key={g.resource_id} name={g.name}><PageLink to={'/galleries/' + g.slug}>{g.name}</PageLink></li>;
            });
        }

        return <div className="row">
            <div className="col-md-12">
                <h2>Twin Cities Galleries</h2>
                <br />
                { galleries }
            </div>
        </div>;

    }
});

module.exports = {
    GalleryIndexPage: GalleryIndexPage,
    GalleryViewPage: GalleryViewPage
}

