var yahoo = require('yahoo-finance'),
	irc = require('irc'),
	request = require('superagent'),
	Qs = require('qs');

module.exports = {

	config:{},

	start:function(config) {
		this.config = config;
		this.ticker('AAPL');
		this.ticker('TWTR');
	},

	ticker:function(symbol) {
		var that = this;
		yahoo.snapshot({
			fields:['a', 'o', 'm5', 'm6', 'm7', 'm8', 'm3', 'm4'],
			symbol:symbol
		}).then(function(snapshot) {
			console.log(snapshot);
			that.send(snapshot);
		});
	},

	send:function(snapshot) {

		var diff = parseFloat((((snapshot.ask - snapshot.open) / snapshot.open) * 100).toFixed(2));

		var messages = [
			{
				title:'',
				text:'Opened at: *'+snapshot.open+"*\n\rAsking Price: *"+snapshot.ask+"* ("+diff+"% "+(diff > 0 ? ':arrow_up_small:' : ':arrow_down_small:')+')',
			}
		];

		var payload = {
				markdwn:true,
				token:this.config.webApiToken,
				channel:'#test',
				text:'Ticker info for '+snapshot.symbol,
				username:'SlackStocks',
				icon_emoji:':chart_with_upwards_trend:',
				attachments:JSON.stringify(messages)
			};
		console.log(payload);
		console.log(Qs.stringify(payload));
		request
			.get('https://slack.com/api/chat.postMessage')
			.send(payload)
			.end(function(err,res) {
				console.log(arguments);
			});
	}

}
