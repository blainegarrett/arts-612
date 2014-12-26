var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var GalleryPage = React.createClass({
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
    componentDidMount: function () {
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
        
        var galleries = []

        if (this.state.galleries.results != undefined) {
            galleries = this.state.galleries.results.map(function (g) {
                return <li key={g.resource_id} name={g.name}><a onClick={ReactRouter.deferTo('/galleries/' + g.slug)}>{g.name}</a></li>;
            });
        }





        return <div className="row">
            <h2>Twin Cities Galleries</h2>

            <a onClick={ReactRouter.deferTo('/calendar')}>Calendar</a>
            <a onClick={ReactRouter.deferTo('/written')}>Written</a>
            <a onClick={ReactRouter.deferTo('/')}>Home</a>
            <br />
        { galleries }
        
        </div>;

    }
});
module.exports = GalleryPage;
