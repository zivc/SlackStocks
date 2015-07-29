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
				title:'$'+snapshot.symbol+' via Yahoo! Finance',
				text:'Current price: *'+snapshot.ask+"*\nOpened: "+snapshot.open+" ("+diff+"%)\n50d Moving Avg: "+snapshot.changeFrom50DayMovingAverage+' ('+snapshot.percentChangeFrom50DayMovingAverage+'%)'+"\n"+"200d Moving Avg: "+snapshot.changeFrom200DayMovingAverage+" ("+snapshot.percentChangeFrom200DayMovingAverage+"%)",
				mrkdwn_in: ["text"],
				color:diff > 0 ? '#2BAF2B' : '#EF5734'
			}
		];

		var payload = {
				markdwn:true,
				token:this.config.webApiToken,
				channel:'#test',
				text:'',
				username:'SlackStocks',
				icon_emoji:':chart_with_upwards_trend:',
				attachments:JSON.stringify(messages)
			};
		request
			.get('https://slack.com/api/chat.postMessage')
			.send(payload)
			.end(function(err,res) {
				console.log(arguments);
			});
	}

}
