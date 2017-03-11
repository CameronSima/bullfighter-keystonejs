var keystone = require('keystone');
var mailer = require('../scripts/mailer.js');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true },
	email_subject_line: { type: String },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	email_sent: { type: Boolean, default: false, hidden: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, utc: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	section: { type: Types.Select, options: 'trading, staff', default: 'trading', required: true, initial: true, index: true }
});

Post.schema.pre('save', function(next) {
	var User = keystone.list('User').model
	if (this.state === 'published' && this.email_sent === false) {
		this.email_sent = true;
		mailer(this, User);
		next();
	}
	next();
})

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});
Post.schema.set('autoIndex', false)
Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%, section|20%';
Post.register();
