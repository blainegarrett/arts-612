var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var PostCategoriesForm = require('./../forms/PostCategoriesForm');

var PostCategoriesEditPage = React.createClass({
    getInitialState: function(){
        return { data: null }
    },

    render: function() {

        var resource_url = '/api/post_categories/' + this.props.keystr;
        var save_callback = function() {
            window.location = '/admin/post_categories';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/post_categries">Post Categories</a> / Edit</h2>
            </div>

            <div className="col-lg-12">
                <PostCategoriesForm container={this} ref="form" resource_url={resource_url} is_edit={true} save_callback={save_callback} />
            </div>
        </div>;
        }
});

module.exports = PostCategoriesEditPage