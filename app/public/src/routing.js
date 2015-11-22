/* All things Routing Related */
var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var useScroll = require('scroll-behavior/lib/useStandardScroll');

// Layout
var NavCardsContainer = require('./components/NavCardsContainer').NavCardsContainer;

// Actual Pages
var NewHomePage = require('./components/pages/NewHomePage');
var EventPage = require('./components/pages/EventPage');
var WrittenPages = require('./components/pages/Written');
var GalleryPages = require('./components/pages/GalleryPages');
var AboutPage = require('./components/pages/AboutPage');
var Error404Page = require('./components/pages/Error404Page');
var MapTestPages = require('./components/pages/MapTestPages');

// Setup Default History
var history = createBrowserHistory(); // useScroll(createBrowserHistory)(); // This forces pages to scroll to top, but not smoothly as desired.
var AppShell = require('./components/appshell').AppShell;
var MegaApp = require('./components/appshell').MegaApp;
var App = require('./components/appshell').App;

function init_router (node) {
    React.render(<Router history={history}>
        <Route path="/" component={AppShell}>
          <IndexRoute component={NewHomePage}/>

          <Route path="about" component={AboutPage}/>
          <Route path="events/:slug" component={EventPage}/>

          <Route path="galleries/:slug" component={GalleryPages.GalleryViewPage}/>
          <Route path="galleries" component={GalleryPages.GalleryIndexPage}/>

          <Route path="map" component={MegaApp}>
              <Route path="events" component={MapTestPages.EventShell}>
                <Route path=":slug" component={MapTestPages.EventPageShell}>
                    <Route path="tacos" component={MapTestPages.EventPageTacoPage}/>
                    <Route path="/pictures/:id" component={MapTestPages.PicturePage} />
                    <IndexRoute component={MapTestPages.EventPageIndexPage}/>
                </Route>

                <IndexRoute component={MapTestPages.IndexPage}/>
              </Route>
          </Route>

          <Route path="written" component={WrittenPages.PageShell}>
            <IndexRoute component={WrittenPages.WrittenPage}/>
            <Route path=":category_slug/:slug" component={WrittenPages.WrittenArticlePage} />
             <Route path=":category_slug" component={WrittenPages.WrittenCategoryPage} />
            <Route path=":year/:month/:slug" component={WrittenPages.WrittenArticlePage} />
          </Route>

          <Route path="*" component={Error404Page}/>
        </Route>
    </Router>, node);
}

module.exports = {
    init: init_router,
    history: history
};