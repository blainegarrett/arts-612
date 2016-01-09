/* Advertisement Display Components */
var React = require('react');
var linkTo = require('../../linking').linkTo;


// TODO: Move this to legit store
var advert_store = [
    {
        resource_type: "Advert",
        advert_label: "mpls70s-1",
        image_url: "/static/jive/dt_amazon_ad1.jpg",
        goto_url: "http://www.amazon.com/gp/product/0873519922/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0873519922&linkCode=as2&tag=mc09e-20&linkId=2SUJXMBJ2ZBY52QG",
        advert_description: "Minneapolis in the 70s by Mike Evangelist",
    },
    {
        resource_type: "Advert",
        advert_label: "mpls70s-2",
        image_url: "/static/jive/dt_amazon_ad2.jpg",
        goto_url: "http://www.amazon.com/gp/product/0873519922/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0873519922&linkCode=as2&tag=mc09e-20&linkId=2SUJXMBJ2ZBY52QG",
        advert_description: "Minneapolis in the 70s by Mike Evangelist",
    }
];

//var advert_store = [];


var get_random = function() {
    if (advert_store.length > 0)
        return advert_store[Math.floor(Math.random()*advert_store.length)];
    return null;
}

var DefaultRenderer = React.createClass({
    render: function () {
        return (
            <div className="card-container">
                <div className="card-header"></div>
                <div className="card-content">DEFAULT</div>
            </div>
        );
    }
});

var PodRenderer = React.createClass({
    render: function () {
        var r = this.props.resource;

        if (r) {
            return (
                <div className="card-container module-advert">
                    <div className="card-header">
                        <div className="sponsor-text">advertisement</div>
                        <a onClick={linkTo} data-ga-category="advert" data-ga-action="click" data-ga-label={r.advert_label} title={r.advert_description} href={r.goto_url} target="_new">
                            <img className="img-responsive" src={r.image_url} alt={ r.advert_description } />
                        </a>
                    </div>
                </div>
            );
        }
        else {
            return (<div></div>)
        }
    }
});

var AdvertGoober = React.createClass({
    getDefaultProps: function() {
        return { renderer: DefaultRenderer };
    },

    propTypes: {
        renderer: React.PropTypes.any, // A React Class to Render the Event
        resource: React.PropTypes.object, // A Resource (object) from the store, etc or null
    },

    getInitialState: function () {
        return {
            renderer: this.props.renderer,
            resource: this.props.resource,
        }
    },
    render: function () {
        var props = { resource: this.state.resource };
        return React.createElement(this.state.renderer, props);
    }
});


module.exports = {
    Goober: AdvertGoober,
    PodRenderer: PodRenderer,
    get_random: get_random,
};