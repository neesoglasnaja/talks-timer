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
		var left = 0;
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
			},
			pause: function() {
				clearInterval(interval);
			},
			clear: function() {
				clearInterval(interval);
				countFrom = 0;
				left = 0;
			},
			continue: function() {
				var now = new Date()
				var timerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + left.getMinutes(), now.getSeconds() + left.getSeconds(), now.getMilliseconds());
				updateScreen(timerDate);
				interval = setInterval(function(){
						updateScreen(timerDate)
					}, 100)
			},
			addTime: function(minutes) {

			}
		};

		function updateScreen(timerDate) {
			var rightNow = new Date();
			var isPositive = timerDate > rightNow;
			var diff = isPositive ?  ( new Date(timerDate - rightNow)): ( new Date(rightNow - timerDate));
			left = diff;
			timerNode.textContent = (isPositive ? '+': '-') + diff.getMinutes() + ':' + diff.getSeconds();
			for (var i = 0; i < config.chunks.length; i++) {
				if (config.chunks[i].minutes> diff.getMinutes()) {
					document.bgColor = config.chunks[i].color
				}
			}
		}
	}	


	var timer = new Timer(false);
	timer.init(20, config);

	var pauseNode = document.querySelector('.pause');
	var continueNode = document.querySelector('.continue');
	var clearNode = document.querySelector('.clear');
	var addNode = document.querySelector('.add');

	pauseNode.addEventListener('click', function() {
		timer.pause();
	});
	continueNode.addEventListener('click', function() {
		timer.continue();
	});
	clearNode.addEventListener('click', function() {
		timer.clear();
	});
	addNode.addEventListener('click', function() {
		timer.addTime(5);
	});

})();