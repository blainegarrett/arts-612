/** @jsx React.DOM */
/*global React, moment */
/* jshint trailing:false, quotmark:false, newcap:false */


var post_data = {
    'title': 'Jules Verne is Rad As Hell',
    'content': ' It is with great pleasure that we introduce you to the new owners of mplsart.com, Katie and Blaine Garrett! Kristoffer and I have spent the past few months talking with them about our experience with the site, why it came to be, and our love of artists and this arts scene. We’ve talked about what makes the site and the scene work and what could make it better. From the first meeting, Katie and Blaine have voiced a true passion for digging in, supporting, and building upon what we\'ve started as a way to provide insight and guidance into this thing we call Minneapolis art. We were sold. We know they have the passion to make this work and we are happy to be handing over the keys. In the following months, they’ll have much to share. And we’ll be eagerly waiting to see what mplsart.com grows into. As Kristoffer and I step aside, we ask that you welcome Katie and Blaine and continue to support the galleries and artists of Minneapolis and beyond. ',
    'primary_image': 'https://scontent-b-ord.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/10612934_10105497726369220_7905413968404678817_n.jpg?oh=1b353059e93e6b0714f2247a397ec20d&oe=550870EF',
    'author': { 'firstname': 'Captain', 'lastname': 'Kangaroo'},
    'created_date': 'August 24, 2013 9:00 PM'
};


var BlogArticlePage = React.createClass({
    getInitialState: function(){
        document.title = post_data.title + ' | mplsart.com';

        return {
            'post_data': post_data
        };
    },

    render: function () {
        return <div>
        <div class="row">
      	<div class="col-md-12" id="welcome-header-container">
    			<h1 id="welcome-header">
    				GOOD NEWS, MINNEAPOLIS
    			</h1>
    		</div>
    	</div>
        <div className="row">
            <div className="col-md-6">
                <article>
                    <h2><a href="singlepost.html">{ this.state.post_data.title }</a></h2>

                    <div className="row">
                        <div className="group1 col-md-12 well">
                            <span className="glyphicon glyphicon-pencil"></span> by { this.state.post_data.author.firstname} { this.state.post_data.author.lastname}
                            <br />                           
                              <span className="glyphicon glyphicon-time"></span> August 24, 2013 9:00 PM
                        </div>

                    </div>


                    <img src={this.state.post_data.primary_image} className="img-responsive" />

                    <br />

                    <p className="lead" dangerouslySetInnerHTML={{__html: this.state.post_data.content}} />

                    <hr />
                </article>
            </div>

    		<div className="col-md-3 panel-events"><TempUpcoming col_name="Upcoming" /></div>
    		<div className="col-md-3 panel-events"><TempEvents col_name="Now Showing"  /></div>
        </div>
        
        <footer id="main-content-footer"><p>We love art. We love you. &copy; 2014 mplsart</p></footer>
        </div>;
    }
});





mainApp.value('SocialTags', SocialTags);
mainApp.value('BlogArticlePage', BlogArticlePage);