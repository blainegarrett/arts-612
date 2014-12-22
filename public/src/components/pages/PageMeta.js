var PageMetaStore = require('../../stores/PageMetaStore');
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var React = require('react');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getPageMetaState() {
  return PageMetaStore.getRaw();
}


var PageMeta = React.createClass({
    getInitialState: function() {
      return getPageMetaState();
    },

    componentDidMount: function() {
        // Subscribe to changes in the page meta
        PageMetaStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        // Un-Subscribe to changes in the page meta
      PageMetaStore.removeChangeListener(this._onChange);
    },

    render: function(){
        //if (Object.keys(this.props.allTodos).length < 1) {
        //  return null;
        //}

        console.log('rendering...')
        console.log(this.state);

        var meta = this.state;
        var menu_ops = [];

        menu_ops.push(<li><a onClick={this.addPageMeta}>Add</a></li>)        
        menu_ops.push(<li><a href="#" title={meta.description}>{meta.title}</a></li>)
        //menu_ops.push(<li><a href="#about">Aboutxxx</a></li>)

        return <ul className="nav navbar-nav">{ menu_ops}</ul>;
    },
    _onChange: function() {
      console.log('Received a change..?')
      this.setState(getPageMetaState()); 
    },
    addPageMeta: function() {
        console.log('adding page meta...');
        AppDispatcher.handleSetMeta({
            title: 'zippy',
            description: 'This is a page description...'
        });
    }
    
});

module.exports = PageMeta;