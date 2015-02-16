var React = require('react');
var FileUploader = require('./../components/FileUploader');
var B = require('react-bootstrap');




var FileInfoOverLay = React.createClass({
    getInitialState: function(){
        var state = {file: this.props.file};
        return state;
    },

    render : function () {
        return <B.Popover title="Popover left"><strong>Hoddddddddddly guacamole!</strong> Check this info.</B.Popover>
    }
});

var FileRecord = React.createClass({
    getInitialState: function(){
        var state = {
            file: this.props.file,
            editing: false,
            saving: false
        };
        return state;
    },

    typeHandler: function (e) {
        var f = this.state.file;
        f.caption = event.target.value;
        this.setState({file: f, editing:true})
    },

    changeHandler: function (e) {
        
        // Just in case the last key stroke didn't get recorded
        this.typeHandler(e);
        this.setState({editing: false, saving:true})

        var caption = event.target.value;
        var restData = {"caption": event.target.value};

        $.ajax({
            url: this.state.file.resource_url,
            data: JSON.stringify(restData),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            type: 'POST',

            success:  function(data) {
                // clear spinner... update store with new file
                this.setState({
                    file: data.results,
                    editing: false,
                    saving:false
                })

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)

        });
    },

    render: function(){
        var styles = {}
        styles['background-image'] = 'url("' + this.state.file.versions.THUMB.url + '")';

        var overlay = <B.Popover title={ this.state.file.filename }>
                <textarea className="form-control inline-editable" disabled={this.state.saving} type="text" placeholder="Click to Edit Caption" value={ this.state.file.caption } onBlur={ this.changeHandler } onChange={ this.typeHandler } />
            </B.Popover>;

        return <div className="col-lg-2 col-md-2 col-sm-3 col-xs-4">
                <B.OverlayTrigger trigger="click" placement="left" overlay={overlay}>
                    <a className="thumbnail" style={styles} title="cheeseburger"></a>
                </B.OverlayTrigger>
            </div>
    }
    
});


var FilesMainPage = React.createClass({

    upload_error_callback: function() {
        alert('ERROR CALLBACK FIRING');
    },

    upload_success_callback: function(file_resource) {
        alert('SUCCESS CALLBACK FIRING');
        console.log(file_resource);
    },    

    getInitialState: function(){
        var state = {
            data: [], 
            resource_url: '/api/files'
        };
        return state;
    },
    
    componentDidMount: function(){
        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },

    render: function() {
        
        var thumbs;
        
        if (this.state.data.results && this.state.data.results.length > 0) {
            var thumbs = this.state.data.results.map(function (r) {
                return <FileRecord file={r} />
            });
        }
        
        return <div className="row">
        
            <h2><a href="/admin">Admin</a> / Files</h2>
                
            <b>Files Home Page</b>

            <FileUploader
                allow_multiple={ true }
                callback_url="/api/files/upload_callback" 
                
                upload_success_callback = { this.upload_success_callback }
                upload_error_callback = { this.upload_error_callback } />
            
            <div className="container">
                 <div className="row" id="thumbs">
                    { thumbs }
                 </div>
            </div>
        </div>;
        
    }

});
module.exports = FilesMainPage;