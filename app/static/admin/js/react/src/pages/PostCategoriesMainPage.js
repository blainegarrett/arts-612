var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');


var PostCategoriesGrid = React.createClass({
    /* Grid of Venues */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/post_categories'};
        state['columns'] = ['title', 'slug', 'actions'];
        
        state['inline_actions'] = [
            {
                title: 'Edit',
                url: function(obj){ return '/admin/post_categories/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },
        ];

        state['global_actions'] = [
            {
                title: 'Add Category',
                url: '/admin/post_categories/create',
                icon: 'map-user'
            },  
        ];

        return state;
    },

    render: function() {
        return <div>{this.render_templatexxx()}</div>
    }
});

var PostCategoriesPage = React.createClass({
    render: function() {
        return <div className="row">
                    <div className="col-lg-12">
                        <h2><a href="/admin">Admin</a> / Post Categories</h2>  
                        <PostCategoriesGrid />
                </div>
            </div>;
    }
});

module.exports = PostCategoriesPage;
