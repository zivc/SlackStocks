var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;

// test route
app.get('/hello', function (req, res) {
	console.log(req.body);
	res.status(200).send('Hello world!');
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});
