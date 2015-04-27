var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');


var BlogPostsGrid = React.createClass({
    /* Grid of Venues */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/posts'};
        state['columns'] = ['title', 'summary', 'is_published', 'actions'];
        
        state['inline_actions'] = [
            {
                title: 'Edit',
                url: function(obj){ return '/admin/blog/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },
        ];

        state['global_actions'] = [
            {
                title: 'Add Blog Post',
                url: '/admin/blog/create',
                icon: 'map-marker'
            },  
        ];

        return state;
    },

    render: function() {
        return <div>{this.render_templatexxx()}</div>
    }
});


var BlogMainPage = React.createClass({
    render: function() {
        return <div className="row">
                    <div className="col-lg-12">
                        <h2><a href="/admin">Admin</a> / Blog</h2>  
                        <BlogPostsGrid />
                </div>
            </div>;
    }
});
module.exports = BlogMainPage;
