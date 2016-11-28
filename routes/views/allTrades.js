var keystone = require('keystone')
var _ = require('lodash')
var Trade = keystone.list('Trade')
var User = keystone.list('User')


exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'trades'
	locals.data = {
		trades: [],
		graphArr: []
	}

	view.on('init', function(next) {

		var direction, sortParam
		if (req.params.direction && req.params.sortParam) {
			if (req.params.direction === 'desc') {
				direction = '-'
			} else {
				direction = ''
			}
			sortParam = direction + 'content.' + req.params.sortParam
		} else {
			sortParam = '-publishedDate'
		}

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

			q.exec(function(err, results) {

				// get graph data
				

				locals.data.trades = results
				next(err)
			})
	})
	view.render('allTrades')

}