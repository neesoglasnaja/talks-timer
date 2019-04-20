(function() {

	var timerStepNode = document.querySelector('.timer');
	var timeout = 300;

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
		var finalTime = null;
		var minutesNode = document.querySelector('.timer__minutes');
		var secondsNode = document.querySelector('.timer__seconds');

		return {
			init: function(minutes, config) {
				timerStepNode.classList.remove('_paused');
				
				if (minutes !== undefined) countFrom = minutes;
				finalTime = new Date(Date.now() + countFrom * 60 * 1000);
				updateScreen();
				interval = setInterval(updateScreen, timeout);
			},
			toggle: function() {
				if (isInProgress) { pause(); }
				else { resume(); }
			},
			clear: function() {
				clearInterval(interval);
				countFrom = 0;
				finalTime = null;

				events.showOptions();
			},
			updateTime(minutes) {
				pause();
				finalTime = new Date(Date.now() + getLeftovers(minutes));
				updateScreen();
				resume();
			}
		};

		function pause() {
			clearInterval(interval);
			isInProgress = false;
			timerStepNode.classList.add('_paused')
		}

		function resume() {
			finalTime = new Date(Date.now() + getLeftovers());
			interval = setInterval(updateScreen, timeout);

			timerStepNode.classList.remove('_paused');
		}

		function updateScreen() {
			if (!isInProgress) isInProgress = true;

			var rightNow = new Date();
			var isPositive = finalTime > rightNow;

			var time = isPositive ? (finalTime - rightNow) : (rightNow - finalTime);
			var minutes = parseInt(time/1000/60, 10);
			var seconds = parseInt((time - minutes * 60 * 1000)/1000, 10);

			minutesNode.textContent = (isPositive ? '' : '-') + minutes;
			secondsNode.textContent = (seconds < 10 ? '0' : '') + seconds;
			timerStepNode.setAttribute('data-value', time * (isPositive ? 1: -1));

			for (var i = 0; i < config.chunks.length; i++) {
				if (config.chunks[i].minutes >= minutes * (isPositive ? 1: -1)) {
					document.bgColor = config.chunks[i].color;
				}
			}
		}

		function getLeftovers(additionalMinutes) {
			var value = parseInt(timerStepNode.getAttribute('data-value'), 10) + (additionalMinutes ? parseInt(additionalMinutes, 10)*60*1000 : 0);
			
			return value;
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