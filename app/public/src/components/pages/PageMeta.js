var PageMetaStore = require('../../stores/PageMetaStore');
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var ReactRouter = require('flux-react-router');
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

        var meta, meta_tags;
        $('.dynamic_meta').each(function(){
            $(this).remove();
        });

        meta = this.state;
        meta_tags = [];

        //Title...
        meta_tags.push(<meta name="title" content={meta.title} />);
        meta_tags.push(<meta itemProp="name" content={meta.title } />);
        meta_tags.push(<meta property="og:title" content={ meta.title } />)
        document.title = meta.title + ' | MPLSART.COM';

        // Description
        meta_tags.push(<meta name="description" content={meta.description} />);
        meta_tags.push(<meta itemProp="description" content={ meta.description } />);
        meta_tags.push(<meta property="og:description" content={ meta.description } />)

        // Image
        if (meta.image) {
            meta_tags.push(<meta property="image" content={ meta.image } />);
            meta_tags.push(<meta property="og:image" content={ meta.image } />)
        }

        //Keywords - TODO: Not currently dynamic
        meta_tags.push(<meta name="keywords" content="minneapolis, st. paul, art, galleries, art openings, painting, jive" />);

        // Twitter Specific
        /*
        <!-- Twitter Card data -->
        <meta name="twitter:card" content="summary_large_image"  />
        <meta name="twitter:site" content="@mplsart" />
        <meta name="twitter:title" content="{[{ pagemeta.title }]}"  />
        <meta name="twitter:description" content="{[{ pagemeta.description }]}"  />
        <meta name="twitter:creator" content="@mplsart"  />
        <!-- Twitter summary card with large image must be at least 280x150px -->
        <meta name="twitter:image:src" content="{[{ pagemeta.image }]}"  />
        */

        // Facebook/OpenGraph specific
        /*
        <!-- Open Graph data -->
        <meta property="og:title" content="Title Here" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="http://www.example.com/" />
        <meta property="og:image" content="http://example.com/image.jpg" />
        <meta property="og:description" content="Description Here" />
        <meta property="og:site_name" content="Site Name, i.e. Moz" />
        <meta property="article:published_time" content="2013-09-17T05:59:00+01:00"  />
        <meta property="article:modified_time" content="2013-09-16T19:08:47+01:00"  />
        <meta property="article:section" content="Article Section"  />
        <meta property="article:tag" content="Article Tag"  />
        <meta property="fb:admins" content="Facebook numberic ID"  />
        */

        return <div>{ meta_tags}</div> ;
    },
    _onChange: function() {
      this.setState(getPageMetaState()); 
    },
    addPageMeta: function() {
        ReactRouter.goTo('/app');
        
        //console.log('adding page meta...');
        //AppDispatcher.handleSetMeta({
        //    title: 'zippy',
        //    description: 'This is a page description...'
        //});
    }
    
});

module.exports = PageMeta;