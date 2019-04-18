(function() {

	var timerStepNode = document.querySelector('.timer');

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
		var interval;
		var isInProgress = false;
		var countFrom = 0;
		var left = 0;
		var minutesNode = document.querySelector('.timer__minutes');
		var secondsNode = document.querySelector('.timer__seconds');

		return {
			init: function(minutes, config) {
				timerStepNode.classList.remove('_paused');
				
				if (minutes !== undefined) countFrom = minutes;
				var timerDate = new Date(Date.now() + countFrom * 60 * 1000);
				updateScreen(timerDate);
				if (!skipUpdate) {
					interval = setInterval(function(){
						updateScreen(timerDate)
					}, 100)
				}
			},
			toggle: function() {
				if (isInProgress) { pause(); }
				else { resume(); }
			},
			
			clear: function() {
				clearInterval(interval);
				countFrom = 0;
				left = 0;

				events.showOptions();
			},
			updateTime(minutes) {
				pause();

				var timerDate = new Date(Date.now() + getLeftovers() + minutes * 60 * 1000);
				updateScreen(timerDate);
				resume();
			}
		};

		function pause() {
			clearInterval(interval);
			isInProgress = false;
			timerStepNode.classList.add('_paused')
		}

		function resume() {
			var timerDate = new Date(Date.now() + getLeftovers());
			updateScreen(timerDate);
			interval = setInterval(function() {
				updateScreen(timerDate);
			}, 100)

			timerStepNode.classList.remove('_paused');
		}

		function updateScreen(timerDate) {
			if (!isInProgress) isInProgress = true;

			var rightNow = new Date();
			var isPositive = timerDate > rightNow;

			var timezoneOffset = timerDate.getTimezoneOffset() * 60 * 1000;
			var diff = isPositive ?  ( new Date(timerDate - Date.now() + timezoneOffset)) : (new Date(Date.now() - timerDate + timezoneOffset));
			minutesNode.textContent = (isPositive ? '': '-') + diff.getMinutes();
			secondsNode.textContent = (diff.getSeconds()< 10 ? '0' : '') + diff.getSeconds();

			for (var i = 0; i < config.chunks.length; i++) {
				if (config.chunks[i].minutes >= diff.getMinutes()) {
					document.bgColor = config.chunks[i].color;
				}
			}

			left = diff;
		}

		function getLeftovers() {
			var minutes = parseInt(minutesNode.innerHTML, 10);
			var seconds = parseInt(secondsNode.innerHTML, 10);

			var isPositive = minutes > 0;

			return (minutes * 60 * 1000 + seconds * 1000) * (isPositive ? 1 : -1);
		}
	}	

	var Events = function () {
		var selectTimeStepNode = document.querySelector('.select-time');
		
		return {
			showTimer(time) {

				selectTimeStepNode.setAttribute("style", "display: none;");
				timerStepNode.setAttribute("style", "display: flex;");

				timer.init(time, config);
			},
			showOptions() {
				selectTimeStepNode.setAttribute("style", "display: flex;");
				timerStepNode.setAttribute("style", "display: none;");
			}
		}
	};


	var timer = new Timer(false);
	var events = new Events();

	var timeOptionNodes = document.querySelectorAll('.select-time__option');

	timeOptionNodes.forEach(node => {
		node.addEventListener('click', function() {
			var time = this.getAttribute('data-time');

			events.showTimer(time);
		});
	});

	var pauseNode = document.querySelector('.timer__pause');
	var clearNode = document.querySelector('.timer__clear');
	var changeTimeNodes = document.querySelectorAll('.timer__change-time');

	clearNode.addEventListener('click', function() {
		timer.clear();
	});

	pauseNode.addEventListener('click', function() {
		timer.toggle();
	});
	changeTimeNodes.forEach(node => {
		node.addEventListener('click', function() {
			var value = parseInt(this.getAttribute('data-value'), 10);

			timer.updateTime(value);
		});
	});

})();