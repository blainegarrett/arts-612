var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var PostCategoriesForm = require('./../forms/PostCategoriesForm');

var PostCategoriesCreatePage = React.createClass({
    render: function() {

        var resource_url = '/api/post_categories';
        var save_callback = function() {
            window.location = '/admin/post_categories';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/post_categries">Post Categories</a> / Create</h2>
                <PostCategoriesForm resource_url={resource_url} is_edit={false} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = PostCategoriesCreatePage