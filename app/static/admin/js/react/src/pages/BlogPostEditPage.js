var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var BlogPostForm = require('./../forms/BlogPostForm');

var BlogPostEditPage = React.createClass({
    render: function() {

        var resource_url = '/api/posts/' + this.props.keystr;
        var save_callback = function() {
            window.location = '/admin/blog';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/blog">Blog</a> / Edit</h2>
                <BlogPostForm ref="form"  resource_url={resource_url} is_edit={true} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = BlogPostEditPage