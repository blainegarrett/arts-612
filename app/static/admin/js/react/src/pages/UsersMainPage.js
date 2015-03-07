var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');


var UsersGrid = React.createClass({
    /* Grid of Venues */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/users'};
        state['columns'] = ['firstname', 'lastname', 'website', 'actions'];
        
        state['inline_actions'] = [
            {
                title: 'Edit',
                url: function(obj){ return '/admin/users/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },
        ];

        state['global_actions'] = [
            {
                title: 'Add User',
                url: '/admin/users/create',
                icon: 'map-user'
            },  
        ];

        return state;
    },

    render: function() {
        return <div>{this.render_templatexxx()}</div>
    }
});

var UsersMainPage = React.createClass({
    render: function() {
        return <div className="row">
                    <div className="col-lg-12">
                        <h2><a href="/admin">Admin</a> / Users</h2>  
                        <UsersGrid />
                </div>
            </div>;
    }
});

module.exports = UsersMainPage;
