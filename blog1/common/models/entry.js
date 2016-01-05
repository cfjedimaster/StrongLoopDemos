module.exports = function(Entry) {

	Entry.observe('loaded', function(ctx, next) {
		if(ctx && ctx.instance && ctx.instance.released) {
			var date = ctx.instance.published;
			ctx.instance.url = "/"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+"/"+ctx.instance.slug;
		}
		next();
	});
	
};
