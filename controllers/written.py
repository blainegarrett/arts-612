"""
Controllers for the Written section
"""

from controllers import BaseController


class WrittenMainHandler(BaseController):
    """
    Serverside Controller logic for written section
    """

    def get(self):
        pagemeta = {
            'title': 'Written',
            'description': 'Crtique, Reviews, and Observations of the Minneapolis / St. Paul Arts Scene',
            'image': 'http://phase-0.arts-612.appspot.com/static/themes/v0/mplsart_fbimg.jpg'}

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)


class WrittenArticleHandler(BaseController):
    """
    """

    def get(self, year, month, slug):
        pagemeta = {
            'title': 'A message from mplsart.com founder, Emma Berg',
            'description': 'It is with great pleasure that we introduce you to the new owners of mplsart.com',
            'image': 'http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg'}

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)



class WrittenMainRssFeedHandler(BaseController):
    """
    Temporary Feed Handler
    TODO: Atom feeds
    TODO: Dynamically Generate this data
    TODO: Add images for posts?
    TODO: Better feed image
    """

    def get(self):
        output = """<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        	<channel>
        		<title>Written Articles on mplsart.com</title>
        		<description>Articles from mplsart.com</description>
        		<link>http://mplsart.com</link>
        		<lastBuildDate>Sun, 11 Dec 2015 15:00:00 CST</lastBuildDate>
        		<pubDate>Sun, 11 Dec 2015 15:00:00 CST</pubDate>
                <language>en</language>
        		<ttl>1800</ttl>
                <image>
                    <url>http://mplsart.com/favicon.ico</url>
                    <title>mplsart.com</title>
                    <link>mplsart.com</link>
                  </image>

        		<item>
        			<title>A message from mplsart.com founder, Emma Berg</title>
        			<link>http://mplsart.com/written/2015/01/new_beginnings_for_mplsart/</link>
        			<guid isPermaLink="false">http://mplsart.com/written/2015/01/new_beginnings_for_mplsart/</guid>
        			<pubDate>Mon, 05 Dec 2015 15:00:00 CST</pubDate>
        			<description><![CDATA[ It is with great pleasure that we introduce you to the new owners of mplsart.com ]]></description>
        			<summary>It is with great pleasure that we introduce you to the new owners of mplsart.com</summary>
        			<updated>Mon, 05 Dec 2015 15:00:00 CST</updated>
        			<published>Mon, 05 Dec 2015 15:00:00 CST</published>
        			<author>
        				<name>Emma Berg</name>
        				<email>calendar@mplsart.com</email>
        				<uri>http://www.emmaberg.com/</uri>
        			</author>
                    <enclosure url="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" length="1010" type="image/png"/>
                    <link rel="enclosure" href="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" length="1010" type="image/png"/>
                    <!-- <media:content url="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" length="1010" type="image/jpeg" height="150" width="150"/> -->
        		</item>
        	</channel>
        </rss>"""
        
        self.response.headers['Content-Type'] = 'application/xml'
        self.response.write(output)
