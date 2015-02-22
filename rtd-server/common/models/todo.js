module.exports = function(Todo) {
    Todo.observe('before save', function(ctx, next) {
        console.log('before save!');
      if (ctx.instance) {
        ctx.instance.modified = new Date();
        ctx.instance.created = ctx.instance.created || new Date();
      } else {
        ctx.data.modified = new Date();
        ctx.data.created = ctx.data.created || new Date();
      }
      next();
    });
};
