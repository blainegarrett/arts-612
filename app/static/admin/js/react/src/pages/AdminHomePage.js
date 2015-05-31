var React = require('react');
var ReactRouter = require('flux-react-router');
var B = require('react-bootstrap')

var FileUploader = require('./../components/FileUploader');


var CustomModalTrigger = React.createClass({
  mixins: [B.OverlayMixin],

  getInitialState: function () {
    return {
      isModalOpen: false
    };
  },

  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  render: function () {
    return (
      <B.Button onClick={this.handleToggle} bsStyle="primary">Launch</B.Button>
    );
  },

  // This is called by the `OverlayMixin` when this component
  // is mounted or updated and the return value is appended to the body.
  renderOverlay: function () {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    return (
        <B.Modal title="Modal heading" onRequestHide={this.handleToggle}>
          <div className="modal-body">
            This modal is controlled by our custom trigger component.
          </div>
          <div className="modal-footer">
            <B.Button onClick={this.handleToggle}>Close</B.Button>
          </div>
        </B.Modal>
      );
  }
});

var AdminHomePage = React.createClass({
    render: function() {
        return <div>

        <B.Alert bsStyle="warning">
            <strong>Under Construction</strong> This is the super temporary admin page. It will get better. I swear. ~Blaine
        </B.Alert>

        <div className="row">
            <div className="col-md-6">

        
                <h2>Hello!</h2>
                <p> This is the super temporary admin page. It will get better. I swear.</p>
                <ul>
                    <li><a href="/admin/venues/">Manage Venues</a></li>
                    <li><a href="/admin/events/">Manage Events</a></li>
                    <li><a href="/admin/blog/">Manage Blog</a></li>
                    <li><a href="/admin/post_categories/">Manage Blog Categories</a></li>
                    <li><a href="/admin/files/">Manage Files</a></li>
                    <li><a href="/admin/users/">Manage Users</a></li>
                </ul>
                
                <h2>Tools</h2>
                <ul>
                    <li><a href="/admin/events/debugger/">Event Search API Debugger</a></li>
                </ul>

                <h2>Settings</h2>
                <dl className="dl-horizontal">
                    <dt>Is Appspot: </dt><dd>{ settings.is_appspot.toString() }</dd>
                    <dt>Domain: </dt><dd>{ settings.domain.toString() }</dd>
                    <dt>Is Authenticated: </dt><dd>{ settings.is_authenticated.toString() }</dd>
                </dl>
            </div>
        </div>


        <div className="row">
            <div className="col-md-6">
                <FileUploader callback_url="/api/files/upload_callback" />
            </div>
        </div>


        <div className="row">
            <div className="col-md-6">
                    <div className="card">
                        <div className="card-image">
                            <a href="#"><img className="img-responsive" src="http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg" /></a>
                            <div className="card-title"><a href="#">Material Cards</a></div>
                        </div>

                        <div className="card-content">
                            <p>Cards for display in portfolio style material design by Google.</p>
                        </div>

                        <div className="card-action">
                            <a href="#" target="new_blank">Link</a>
                            <a href="#" target="new_blank">Link</a>
                            <a href="#" target="new_blank">Link</a>
                            <a href="#" target="new_blank">Link</a>
                            <a href="#" target="new_blank">Link</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                        <div className="card">
                            <div className="card-image">
                                <img className="img-responsive" src="http://www.soapfactory.org/news/img/722_HilaryLundCoalRoom.jpg" />
                                <div className="card-title">Material Cards</div>
                            </div>

                            <div className="card-content">
                                <p>Cards for display in portfolio style material design by Google.</p>
                            </div>

                            <div className="card-action">
                                <a href="#" target="new_blank">Link</a>
                                <a href="#" target="new_blank">Link</a>
                                <a href="#" target="new_blank">Link</a>
                                <a href="#" target="new_blank">Link</a>
                                <a href="#" target="new_blank">Link</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                            <div className="card">
                                <div className="card-image">
                                    <img className="img-responsive" src="http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7TDlCYzRROE84YWM/materialdesign_introduction.png" />
                                    <div className="card-title">Material Cards</div>
                                </div>

                                <div className="card-content">
                                    <p>Cards for display in portfolio style material design by Google.</p>
                                </div>

                                <div className="card-action">
                                    <a href="#" target="new_blank">Link</a>
                                    <a href="#" target="new_blank">Link</a>
                                    <a href="#" target="new_blank">Link</a>
                                    <a href="#" target="new_blank">Link</a>
                                    <a href="#" target="new_blank">Link</a>
                                </div>
                            </div>
                        </div>

            </div>


        <div className="row">
            <div className="col-md-12">

            <br />
            <br />
        <CustomModalTrigger />

          <B.ButtonToolbar>
            <B.OverlayTrigger trigger="click" placement="left" overlay={<B.Popover title="Popover left"><strong>Holy guacamole!</strong> Check this info.</B.Popover>}>
              <B.Button bsStyle="default">Holy guacamole!</B.Button>
            </B.OverlayTrigger>
            <B.OverlayTrigger trigger="click" placement="top" overlay={<B.Popover title="Popover top"><strong>Holy guacamole!</strong> Check this info.</B.Popover>}>
              <B.Button bsStyle="default">Holy guacamole!</B.Button>
            </B.OverlayTrigger>
            <B.OverlayTrigger trigger="click" placement="bottom" overlay={<B.Popover title="Popover bottom"><strong>Holy guacamole!</strong> Check this info.</B.Popover>}>
              <B.Button bsStyle="default">Holy guacamole!</B.Button>
            </B.OverlayTrigger>
            <B.OverlayTrigger trigger="click" placement="right" overlay={<B.Popover title="Popover right"><strong>Holy guacamole!</strong> Check this info.</B.Popover>}>
              <B.Button bsStyle="default">Holy guacamole!</B.Button>
            </B.OverlayTrigger>
          </B.ButtonToolbar>
        );



        <div>
            <B.Panel header="cheese" bsStyle="primary">
              Panel content
            </B.Panel>
              <B.Panel header="Panel heading without title">
                Panel content
              </B.Panel>
              <B.Panel header="Sweeeeet">
                Panel content
              </B.Panel>
            </div>

        <B.Alert bsStyle="warning">
              <strong>Holy guacamole!</strong> Best check yo self, you are not looking too good.
        </B.Alert>
            
            
        </div>
        </div>    
            
            
        </div>
    }
});


module.exports = AdminHomePage;