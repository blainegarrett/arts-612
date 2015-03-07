var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var UsersForm = require('./../forms/UsersForm');

var UserCreatePage = React.createClass({
    render: function() {

        var resource_url = '/api/users';
        var save_callback = function() {
            window.location = '/admin/users';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/venues">Users</a> / Create</h2>
                <UsersForm resource_url={resource_url} is_edit={false} save_callback={save_callback} />
                </div>
            </div>;
        }
});

module.exports = UserCreatePage