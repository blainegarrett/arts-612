var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var BlogPostForm = require('./../forms/BlogPostForm');

var BlogPostCreatePage = React.createClass({
    render: function() {

        var resource_url = '/api/posts';
        var save_callback = function() {
            window.location = '/admin/blog';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/blog">Blog</a> / Create</h2>
                <BlogPostForm resource_url={resource_url} is_edit={false} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = BlogPostCreatePage