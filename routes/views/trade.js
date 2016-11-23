var keystone = require('keystone')

exports = module.exports = function (req, res) {
	var view = new keystone.View(req,res)
	var locals = res.locals

	locals.section = 'trades'
	locals.filters = {
		trade: req.params.trade,
	}
	locals.data = {
		trades: [],
	}

	view.on('init', function (next) {
		var q = keystone.list('Trade').model.findOne({
			state: 'published',
			slug: locals.filters.trade,
		}).populate('author')

		q.exec(function(err, result) {
			locals.data.trade = result
			next(err)
		})
	})

	view.on('init', function (next) {

		var q = keystone.list('Trade').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit(4)
		q.exec(function (err, results) {
			locals.data.posts = results
			next(err)
		})
	})

	view.render('trade')
}