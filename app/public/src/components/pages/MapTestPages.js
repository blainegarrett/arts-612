var React = require('react');
var PageMixin = require('./PageMixin');
var PageLink = require('../../linking').PageLink;
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var StaticContainer = require('react-static-container');

//var transitions = require('app.css')


var RouteCSSTransitionGroup = React.createClass({

  getInitialState: function() {
    return {previousPathname: null}
  },

  componentWillReceiveProps: function(nextProps, nextContext) {
    console.log('-------------------------------');
    console.log(nextContext.location.pathname);
    console.log(this.context.location.pathname);

    if (nextContext.location.pathname !== this.context.location.pathname) {
      this.setState({ previousPathname: this.context.location.pathname })
    }
  },

  render: function () {
    var children = this.props.children;
    var props = this.props;
    var previousPathname = this.state;

    props.children = null;

    console.log(previousPathname);

    return (
      <ReactCSSTransitionGroup {...props}>
          {this.props.children}
      </ReactCSSTransitionGroup>
    )
  },

  componentDidUpdate: function() {
    if (this.state.previousPathname) {
      this.setState({ previousPathname: null })
    }
  }
});

RouteCSSTransitionGroup.contextTypes = {
  location: React.PropTypes.object
}






var PICTURES = [
  { id: 0, src: 'http://cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fOTIwMDAwMQ/card_small.png' },
  { id: 1, src: 'http://cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fNzE2MDAwMQ/card_small.png' },
  { id: 2, src: 'http://cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fODI4MDAwMQ/card_small.png' }
];


var Modal = React.createClass({
  styles: {
    position: 'fixed',
    top: '20%',
    right: '20%',
    bottom: '20%',
    left: '20%',
    padding: 20,
    boxShadow: '0px 0px 150px 130px rgba(0, 0, 0, 0.5)',
    overflow: 'auto',
    background: '#fff'
  },

  render: function () {
    return (
      <div style={this.styles}>
        STUFFSDFSDFDSfsdfsdfsdfsdsdfsdfsdfsdf
        <p><PageLink to={this.props.returnTo}>Back</PageLink></p>
        sdfsdfsdfsd
        {this.props.children}

        sdfsdfsdfsdfsdfdsfsdfsdf
      </div>
    )
  }
})



var PicturePage = React.createClass({
  render: function () {
    return (
      <div>
      This is the picture page....
        <img src={PICTURES[this.props.params.id].src} style={{ height: '80%' }} />
      </div>
    )
  }
})


var EventPageTacoPage = React.createClass({
    render: function () {
        var rc = this;
        return (
            <div>
                <b>TACOS ARE GOOD</b>

                <div>
                  <b>With Modals</b>
                  {
                    PICTURES.map(function(picture) {
                        return (
                            <PageLink key={picture.id} to={`/pictures/${picture.id}`} state={{ modal: true, returnTo: rc.props.location.pathname }}>
                                <img style={{ margin: 10 }} src={picture.src} height="100" />
                             </PageLink>)
                      })
                }
                </div>
                <div>
                  <b>Without Modals</b>
                  {
                    PICTURES.map(function(picture) {
                        return (
                            <PageLink key={picture.id} to={`/pictures/${picture.id}`}>
                                <img style={{ margin: 10 }} src={picture.src} height="100" />
                             </PageLink>)
                      })
                }
                </div>
            </div>
        );

    }
});


var EventPageIndexPage = React.createClass({
    render: function () {
        return <b>Welcome to the main page for this thing</b>
    }
});


var EventPageShell = React.createClass({

    componentWillReceiveProps: function(nextProps) {
        // if we changed routes...

        console.log(nextProps.location.state);


        if ((
          nextProps.location &&
          nextProps.location.key !== this.props.location.key &&
          nextProps.location.state &&
          nextProps.location.state.modal
        )) {
          // save the old children (just like animation)
          console.log('BOOM');
          this.previousChildren = this.props.children
        }
      },


    render: function () {

        var location = this.props.location; // odd name??
        var isModal = (location.state && location.state.modal && this.previousChildren);

        console.log('rendering Appshell..')
        console.log(location);
        console.log(location.state);
        console.log(isModal);
        console.log(this.previousChildren);


        return (
            <div>
                <h2>{ this.props.params.slug }</h2>
                <ul>
                    <li><PageLink to={"/map/events/" + this.props.params.slug + "/"}>main</PageLink></li>
                    <li><PageLink to={"/map/events/" + this.props.params.slug + "/tacos/"}>tacos</PageLink></li>
                </ul>
                <div>
                ....

                <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
                    <div key={location.pathname}>{ this.props.children }</div>
                </ReactCSSTransitionGroup>

                {isModal ?
                    this.previousChildren :
                    (null)
                }

              {isModal && (
                <Modal isOpen={true} returnTo={location.state.returnTo}>
                  {this.props.children}
                </Modal>
              )}




                </div>
            </div>
        );
    }
});


var EventShell = React.createClass({
    render: function () {
        return (
            <div className="row">

                <ReactCSSTransitionGroup transitionName="slider" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
                    <div className="col-xs-2 col-panel">

                        <ul>
                            <li><PageLink to="/map/events">index</PageLink></li>
                            <li><PageLink to="/map/events/event1">event1</PageLink></li>
                            <li><PageLink to="/map/events/event2">event2</PageLink></li>
                            <li><PageLink to="/map/events/event3">event3</PageLink></li>
                            <li><PageLink to="/map/events/event4">event4</PageLink></li>
                            <li><PageLink to="/map/events/event5">event5</PageLink></li>
                        </ul>
                    </div>
                </ReactCSSTransitionGroup>
                <div className="col-xs-8 col-panel">
                    { this.props.children }

                    <div>
                        <hr />
                        Foooter from EventShell component</div>
                </div>
            </div>
        );
    }
});

var EventPage = React.createClass({
    render: function () {
        return (<div>
                <h2>{ this.props.params.slug }</h2>
            Event thing...
            </div>
        );
    }
});

var IndexPage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Page Not Found',
        'description': 'Unable to find page, please check your url',
        'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
    },
    render: function() {
        return (
            <div>
                <p>This is the index page. We can put the calendar here or map, or whatever, we want</p>
            </div>
        );
    },

    pageDidMount: function() {
        this.setMeta();
    }
});

module.exports = {
    IndexPage: IndexPage,
    EventPage: EventPage,
    EventShell: EventShell,
    EventPageShell: EventPageShell,
    EventPageIndexPage: EventPageIndexPage,
    EventPageTacoPage: EventPageTacoPage,
    PicturePage: PicturePage
};
