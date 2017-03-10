var keystone = require('keystone');
var Feed = require('feed');
var async = require('async');
var striptags = require('striptags');

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
				content: striptags(post.content.extended),
				categories: post.categories,
				image: post.image,
				author: post.author
			})
		})

		feed.addCategory('Stocks');
		feed.addCategory('Blog');
	  res.contentType('application/xml');
	  res.write(feed.render('rss-2.0'))
	  res.end()
	})
}