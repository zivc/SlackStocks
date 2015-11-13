var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;

app.use(require('body-parser').urlencoded({ extended: true }));

// test route
app.post('/hello', function (req, res, next) {
	console.log(req.body);
	var userName = req.body.user_name,
		botPayload = {
			text : 'Hello, ' + userName + '!'
		};

	// avoid infinite loop
	if (userName !== 'slackbot') {
		return res.status(200).json(botPayload);
	} else {
		return res.status(200).end();
	}
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});
