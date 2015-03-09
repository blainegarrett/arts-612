var React = require('react');

var TempExtras = React.createClass({
    render: function () {
        return <div>
            <div id="panel-contact">
	            <div className="panel-content"><a href="mailto:calendar@mplsart.com"><b>Contact us</b></a> with questions and to submit event listings.</div>
            </div>


<div id="panel-social">
	<div className="panel-content">
		<a href="https://www.facebook.com/mplsart" id="fb-link" target="_new">
			<span className="fa-stack fa-lg">
				<i className="fa fa-square-o fa-stack-2x"></i>
				<i className="fa fa-facebook fa-stack-1x"></i>
			</span>
		</a>

		<a href="https://twitter.com/mplsart" id="twitter-link" target="_new">  
			<span className="fa-stack fa-lg">
				<i className="fa fa-square-o fa-stack-2x"></i>
				<i className="fa fa-twitter fa-stack-1x"></i>
			</span>
		</a>

		<a href="http://instagram.com/mplsart" id="instagram-link" target="_new">  
			<span className="fa-stack fa-lg">
				<i className="fa fa-instagram fa-stack-2x"></i>
			</span>
		</a>

		&nbsp;&nbsp;Stay Connected to mplsart during the rebuild.
	</div>
</div>


<div id="panel-hashtag">
    <div className="row">
        <div className="solid-bg col-sm-4">
            #mplsart
        </div>
        <div className="solid-white col-sm-8">
            If you're making art or looking at art in the Twin Cities, use the hashtag to show it off.
        </div>
    </div>
</div>


</div>

    }
});

module.exports = TempExtras