var React = require('react');

var PageMixin = require('./PageMixin');
var Footer = require('../temp/Footer');
var TempExtras = require('../temp/TempExtras');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');

var ArticleGoober = require('./../DataTypes/Article').ArticleGoober;
var PodArticleRenderer = require('./../DataTypes/Article').PodArticleRenderer;

var Separator = require('./../../utils/Layout').Separator;
var PageLink = require('../../linking').PageLink;

var Maps = require('../../components/maps/Map');


var AboutPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'About MPLSART.COM',
        'description': 'MPLSART.COM\'s mission is to promote visual art events in the Twin Cities.',
    },

    getInitialState: function () {
        return {

        }
    },

    pageDidMount: function () {
        /* Callback from componentDidMount */
        this.setMeta();
    },

    render: function () {
        return (<div id="HomePageWrapper">
                <Maps.DesktopMap />
            </div>);

    }
});
module.exports = AboutPage;
