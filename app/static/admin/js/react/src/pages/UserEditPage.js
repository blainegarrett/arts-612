var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var UsersForm = require('./../forms/UsersForm');

var UserEditPage = React.createClass({
    getInitialState: function(){
        return { data: null }
    },
    
    render: function() {

        var resource_url = '/api/users/' + this.props.keystr;
        var save_callback = function() {
            window.location = '/admin/users';
        };

        return <div className="row">
            <div className="col-lg-12">
                <h2><a href="/admin">Admin</a> / <a href="/admin/users">Users</a> / Edit</h2>
            </div>

            <div className="col-lg-12">
                <UsersForm container={this} ref="form" resource_url={resource_url} is_edit={true} save_callback={save_callback} />
            </div>
        </div>;
        }
});

module.exports = UserEditPage