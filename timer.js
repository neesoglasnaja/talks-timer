(function() {

	var config = {
		chunks: [{
				minutes: 40,
				color: 'green'
			},
			{
				minutes: 20,
				color: 'orange'
			},
			{
				minutes: 5,
				color: 'red'
		}]
	};

	var Timer = function(skipUpdate) {
		var countFrom = 0;
		var timerNode = document.querySelector('.timer');
		var interval;

		return {
			init: function(minutes, config) {
				if (minutes !== undefined) countFrom = minutes;
				var now = new Date();
				var timerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + countFrom, now.getSeconds(), now.getMilliseconds())
				updateScreen(timerDate);
				if (!skipUpdate) {
					interval = setInterval(function(){
						updateScreen(timerDate)
					}, 100)
				}
			}
		};

		function updateScreen(timerDate) {
			var rightNow = new Date();
			var isPositive = timerDate > rightNow;
			var diff = isPositive ?  ( new Date(timerDate - rightNow)): ( new Date(rightNow - timerDate));
			timerNode.textContent = (isPositive ? '+': '-') + diff.getMinutes() + ':' + diff.getSeconds();
			for (var i = 0; i < config.chunks.length; i++) {
				if(config.chunks[i].minutes> diff.getMinutes()){
					document.bgColor = config.chunks[i].color
				}
			}
		}
	}	


	var timer = new Timer(true);
	timer.init(20, config);

})();