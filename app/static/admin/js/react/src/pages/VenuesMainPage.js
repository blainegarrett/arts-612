var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');


var VenuesGrid = React.createClass({
    /* Grid of Venues */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/galleries'};
        state['columns'] = ['name', 'category', 'actions'];
        
        state['inline_actions'] = [
            {
                title: 'Edit',
                url: function(obj){ return '/admin/venues/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },
        ];

        state['global_actions'] = [
            {
                title: 'Add Venue',
                url: '/admin/venues/create',
                icon: 'map-marker'
            },  
        ];

        return state;
    },

    render: function() {
        return <div>{this.render_templatexxx()}</div>
    }
});


var VenuesMainPage = React.createClass({
    render: function() {
        return <div className="row">
                    <div className="col-lg-12">
                        <h2><a href="/admin">Admin</a> / Venues</h2>  
                        <VenuesGrid />
                </div>
            </div>;
    }
});
module.exports = VenuesMainPage;
