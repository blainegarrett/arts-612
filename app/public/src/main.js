// React is global
var React = require('react');
var ReactRouter = require('flux-react-router');
var HomePage = require('./components/pages/HomePage');
var CalendarPage = require('./components/pages/CalendarPage');
var WrittenPage = require('./components/pages/WrittenPage');
var WrittenArticlePage = require('./components/pages/WrittenArticlePage');
var GalleryPage = require('./components/pages/GalleryPage');
var GalleryViewPage = require('./components/pages/GalleryViewPage');
var Error404Page = require('./components/pages/Error404Page');

var PageMeta = require('./components/pages/PageMeta');
var PrimaryMenu = require('./components/pages/PrimaryMenu')


/* Figure out what to do with Routes... This is fugly... */
ReactRouter.createRoute('/', function () {
    React.unmountComponentAtNode(document.getElementById('main_content'));
    React.render(<HomePage />, document.getElementById('main_content'));
});
ReactRouter.createRoute('/calendar', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<CalendarPage/>, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/galleries', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryPage />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/galleries/{slug}', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryViewPage slug={params.slug} />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/written', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenPage />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/written/{year}/{month}/{slug}', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenArticlePage year={params.year} month={params.month} slug={params.slug} />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<Error404Page />, document.getElementById('main_content'));    
});
ReactRouter.init();

/* Components outside of the main_content area*/
React.render(<PageMeta />, document.getElementById('page_meta'));
//React.render(<PageMeta />, document.getElementById('meta_debug'));
//React.render(<PrimaryMenu />, document.getElementById('navbar'));