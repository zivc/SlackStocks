var yahoo = require('yahoo-finance'),
	irc = require('irc'),
	request = require('superagent');

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
		request
			.post('https://slack.com/api/chat.postMessage?token=xoxp-6912664727-6913368165-8367331365-6f2cfa')
			.send(JSON.stringify({
				username:'SlackStocks',
				icon_emoji:':taco:',
				attachments:[
					{
						title:'Ticker info for '+snapshot.symbol,
						text:snapshot.ask,
						color:'#FF6600'
					}
				]
			}))
			.end(function(err,res) {
				console.log(arguments);
			});
	}

}
