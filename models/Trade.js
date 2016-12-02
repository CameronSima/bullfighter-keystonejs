var keystone = require('keystone')
var async = require('async')

var Types = keystone.Field.Types

var Trade = new keystone.List('Trade', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
})

Trade.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', required: true, initial: true, index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }},
	image: { type: Types.CloudinaryImage },
	content: {
		notes: { type: Types.Html, wysiwyg: true, height: 400 },
		direction: { type: Types.Select, options: 'LONG, SHORT' },
		symbol: { type: Types.Text },
		numberBought: { type: Types.Number, required: true, initial: true },
		boughtDate: { type: Types.Datetime, required: true, initial: true, },
		soldDate: { type: Types.Datetime, required: true, initial: true, },
		boughtPrice: { type: Types.Money, format: '$0,0.00', required: true, initial: true, },
		soldPrice: { type: Types.Money, format: '$0,0.00', required: true, initial: true, },
		percentChange:  { type: Types.Number, hidden: true },
		balance: { type: Types.Money, format: '$0,0.00' }
	}
})

Trade.schema.pre('save', function(next) {
	var diff = this.content.boughtPrice - this.content.soldPrice
	this.content.percentChange = Math.abs(diff / this.content.boughtPrice * 100).toFixed(1)
	next()
})

// Update User's balance, and add the balance to trade
Trade.schema.pre('save', function(next) {

	var self = this
	keystone.list('User').model.findOne({
		author: this.author._id
	})
	.exec(function(err, user) {

		var newBalance = (self.content.numberBought * (self.content.soldPrice - self.content.boughtPrice)) + user.balance
		user.balance = newBalance
		self.content.balance = newBalance
		user.save(function(err, user) {
			if (err) {
				console.log(err)
			} else {
				next(err)
			}
		})
	})
})


Trade.schema.set('autoIndex', false)
Trade.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%'
Trade.register()