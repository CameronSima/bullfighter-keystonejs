var keystone = require('keystone');
var Feed = require('feed');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var year = new Date().getFullYear();

	var feed = new Feed({
		title: 'the Bullfighter Blog RSS',
		id: 'http://thebullfightertrading.com/',
		link: 'http://thebullfightertrading.com/',
		description: 'BFT Main Blog',
		author: 'BFT',
		copyright: 'All rights reserved ' + year + ', BFT',
		updated: new Date(),

		author: {
			name: 'BFT',
			email: 'thebullfightertrading@gmail.com'
		}
	})

	var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author')
	q.exec(function (err, results) {
		results.forEach(function(post) {
			feed.addItem({
				title: post.title,
				id: post._id,
				published: post.publishedDate,
				body: post.content.extended,
				categories: post.categories,
				image: post.image,
				author: post.author
			})
		})
		console.log(feed)

		feed.addCategory('Stocks');
	  feed.render('rss-2.0');
	  

		// res.set('Content-Type', 'text/xml');
	 //  res.send(feed);
	})
}