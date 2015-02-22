var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

var ds = loopback.createDataSource({
    connector: require('loopback-component-storage'),
    provider: 'filesystem',
    root: path.resolve(__dirname, '../client')
});
var container = ds.createModel('container');
app.model(container);

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
