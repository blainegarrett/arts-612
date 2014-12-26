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
        meta_tags.push(<meta name="title" content={meta.title} class="dynamic_meta"/>);
        meta_tags.push(<meta itemprop="name" content={meta.title } class="dynamic_meta"/>);
        meta_tags.push(<meta property="og:title" content={ meta.title } class="dynamic_meta"/>)
        document.title = meta.title + ' | mplsart.com';

        // Description
        meta_tags.push(<meta name="description" content={meta.description} class="dynamic_meta"/>);
        meta_tags.push(<meta itemprop="description" content={ meta.description } class="dynamic_meta"/>);
        meta_tags.push(<meta property="og:description" content={ meta.description } class="dynamic_meta"/>)

        // Image
        if (meta.image) {
            meta_tags.push(<meta property="image" content={ meta.image } class="dynamic_meta"/>);
            meta_tags.push(<meta property="og:image" content={ meta.image } class="dynamic_meta"/>)
        }

        //Keywords - TODO: Not currently dynamic
        meta_tags.push(<meta name="keywords" content="minneapolis, st. paul, art, galleries, art openings, painting, jive" class="dynamic_meta"/>);

        // Twitter Specific
        /*
        <!-- Twitter Card data -->
        <meta name="twitter:card" content="summary_large_image" class="dynamic_meta" />
        <meta name="twitter:site" content="@mplsart" class="dynamic_meta"/>
        <meta name="twitter:title" content="{[{ pagemeta.title }]}" class="dynamic_meta" />
        <meta name="twitter:description" content="{[{ pagemeta.description }]}" class="dynamic_meta" />
        <meta name="twitter:creator" content="@mplsart" class="dynamic_meta" />
        <!-- Twitter summary card with large image must be at least 280x150px -->
        <meta name="twitter:image:src" content="{[{ pagemeta.image }]}" class="dynamic_meta" />
        */

        // Facebook/OpenGraph specific
        /*
        <!-- Open Graph data -->
        <meta property="og:title" content="Title Here" class="dynamic_meta"/>
        <meta property="og:type" content="article" class="dynamic_meta"/>
        <meta property="og:url" content="http://www.example.com/" class="dynamic_meta"/>
        <meta property="og:image" content="http://example.com/image.jpg" class="dynamic_meta"/>
        <meta property="og:description" content="Description Here" class="dynamic_meta"/>
        <meta property="og:site_name" content="Site Name, i.e. Moz" class="dynamic_meta"/>
        <meta property="article:published_time" content="2013-09-17T05:59:00+01:00" class="dynamic_meta" />
        <meta property="article:modified_time" content="2013-09-16T19:08:47+01:00" class="dynamic_meta" />
        <meta property="article:section" content="Article Section" class="dynamic_meta" />
        <meta property="article:tag" content="Article Tag" class="dynamic_meta" />
        <meta property="fb:admins" content="Facebook numberic ID" class="dynamic_meta" />
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