var keystone = require('keystone')
var Types = keystone.Field.Types

var Trade = new keystone.List('Trade', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
})

Trade.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }},
	image: { type: Types.CloudinaryImage },
	content: {
		notes: { type: Types.Html, wysiwyg: true, height: 400 },
		direction: { type: Types.Select, options: 'LONG, SHORT' },
		symbol: { type: Types.Text },
		boughtDate: { type: Types.Datetime, default: Date.now(), initial: true, dependsOn: {state: 'published'}, required: true },
		soldDate: { type: Types.Datetime, default: Date.now(), initial: true, dependsOn: {state: 'published'}, required: true },
		boughtPrice: { type: Types.Money, format: '$0,0.00', initial: true, default: 0, dependsOn: {state: 'published'}, required: true },
		soldPrice: { type: Types.Money, format: '$0,0.00', initial: true, default: 0, dependsOn: {state: 'published'}, required: true },
	}
})

Trade.schema.virtual('content.percentChange').get(function() {
	var diff = this.content.boughtPrice - this.content.soldPrice
	return Math.abs(diff / this.content.boughtPrice * 100).toFixed(1)
})



Trade.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%'
Trade.register()