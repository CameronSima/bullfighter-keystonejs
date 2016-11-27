var keystone = require('keystone')
var async = require('async')

exports = module.exports = function( req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'trades'
	locals.data = {
		trades: []
	}

	view.on('init', function(next) {
		var direction
		if (req.params.direction === 'desc') {
			direction = '-'
		} else {
			direction = ''
		}
		var sortParam =  direction + 'content.' + req.params.sortParam
		
		var q = keystone.list('Trade').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort(sortParam)
			.populate('author')

			q.exec(function (err, results) {
				locals.data.trades = results
				next(err)
			})
	})
	view.render('allTrades')
}