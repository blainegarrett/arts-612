// React is global
var React = require('react');
var ReactRouter = require('flux-react-router');
var HomePage = require('./components/pages/HomePage');
var CalendarPage = require('./components/pages/CalendarPage');
var GalleryPage = require('./components/pages/GalleryPage');
var PageMeta = require('./components/pages/PageMeta');
var PrimaryMenu = require('./components/pages/PrimaryMenu')


console.log('initial page load...');


/* Figure out what to do with Routes... This is fugly... */
ReactRouter.createRoute('/app', function () {
    React.unmountComponentAtNode(document.getElementById('main_content'));
    React.render(<HomePage />,     document.getElementById('main_content'));
});
ReactRouter.createRoute('/app/calendar', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<CalendarPage/>, document.getElementById('main_content'));    
});
ReactRouter.createRoute('/app/galleries', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryPage/>, document.getElementById('main_content'));    
});


ReactRouter.createRoute('*', '/app');
ReactRouter.init();

/* Components outside of the main_content area*/
//React.render(<PageMeta />, document.getElementById('page_meta'));
//React.render(<PageMeta />, document.getElementById('meta_debug'));
//React.render(<PrimaryMenu />, document.getElementById('navbar'));