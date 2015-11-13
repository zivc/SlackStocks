var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;

app.use(require('body-parser').urlencoded({ extended: true }));

// test route
app.post('/hello', function (req, res, next) {
	console.log(req.body);
	var ticker = req.body.text.substr(2),
		botPayload = {
			text : 'Chart for $TSLA',
			image_url: 'http://chart.finance.yahoo.com/t?s='+ticker.toUpperCase()+'&lang=en-US&region=US&width=450&height=250'
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
