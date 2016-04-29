module.exports = function(Person) {

	Person.beforeRemote('find', function(ctx, instance, next) {
		if(!ctx.args.filter || !ctx.args.filter.limit) {
			console.log('forcing limit!');
			if(!ctx.args.filter) ctx.args.filter = {};
			ctx.args.filter.limit = 10;
		}
		next();
	});
};
