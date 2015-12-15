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
        return <div id="HomePageWrapper">

            <div className="row">

                <div className="col m6" id="main-content-container">

                    <h2><b>About</b></h2>

                    <p className="lead">MPLSART.COM’s mission is to promote visual art events in the Twin Cities.</p>

                    <p>The site is maintained purely in support of local art. It makes events accessible to a broad audience by providing a single source for a variety of listings and related information.</p>

                    <p>Success is more people in attendance at art events, stronger sales of local art, and an open creative community that welcomes all art enthusiasts.</p>

                </div>

                <div className="col m6" id="main-content-container">

                    <h2><b>History</b></h2>


                    <p>MPLSART.COM was founded in 2005 by the incomparable designer/curator, Emma Berg. She saw a need for a consolidated, curated listing of important art events in the Twin Cities. In 2006, Emma was joined by fellow arts advocate, Kristoffer Knutson. Together, they ran the site and curated a host of exhibits and creativity-infused events. It was a work of passion, blood, sweat and so on.</p>



                    <h2><b>Evolution</b></h2>


                    <p>Ten years after the original launch, MPLSART.COM lives on under <PageLink to="/written/2015/01/new_beginnings_for_mplsart/">Blaine and Katie Garrett</PageLink>. The new owners are driven by sincere devotion to promoting the local scene. The re-build has just begun and the site will continue to evolve as a platform for event listings, discussions, artist promotion, and celebrating local success.</p>

                    <br />

                </div>
            </div>

            <Separator />

            <div className="row">

                <div className="col m6" id="main-content-container">

                    <div className="row">
                        <TempExtras />
                    </div>

                </div>
                <div className="col m3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                <div className="col m3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
            </div>

            <Footer />
        </div>;

    }
});
module.exports = AboutPage;
