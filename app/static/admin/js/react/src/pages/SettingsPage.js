var React = require('react');
var BlogPostForm = require('./../forms/SettingsForm');

var SettingsPage = React.createClass({
    render: function() {

        var resource_url = '/api/settings';
        var save_callback = function() {
            window.location = '/admin';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / Settings</h2>
                <BlogPostForm ref="form"  resource_url={resource_url} is_edit={true} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = SettingsPage