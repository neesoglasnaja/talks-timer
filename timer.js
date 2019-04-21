(function() {

	var timerStepNode = document.querySelector('.timer');
	var bodyNode = document.querySelector('body');
	var timeout = 300;

	var maxHue = 110;

	var Timer = function(skipUpdate) {
		var interval;
		var isInProgress = false;
		var countFrom = 0;
		var finalTime = null;
		var minutesNode = document.querySelector('.timer__minutes');
		var secondsNode = document.querySelector('.timer__seconds');

		return {
			init: function(minutes) {
				if (minutes !== undefined) countFrom = minutes;

				timerStepNode.classList.remove('_paused');
				timerStepNode.setAttribute('data-time', countFrom * 60 * 1000)
				bodyNode.style.setProperty('--main-hue', maxHue);
				
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
				var initialTime = parseInt(timerStepNode.getAttribute('data-time'));
				var newTime = initialTime + minutes * 60 * 1000;
				timerStepNode.setAttribute('data-time', newTime > 1 ? newTime : 1);
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

			var fullTime = isPositive ? time : time * -1;
			var originTime = parseInt(timerStepNode.getAttribute('data-time'), 10);

			var hue =  parseInt(fullTime / originTime * maxHue);
			bodyNode.style.setProperty('--main-hue', hue > 0 ? hue : 0);
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

				timer.init(time);
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
	var timeNode = document.querySelector('.timer__time');
	var changeTimeNodes = document.querySelectorAll('.timer__change-time');

	clearNode.addEventListener('click', function() {
		timer.clear();
	});

	pauseNode.addEventListener('click', function() {
		timer.toggle();
	});

	timeNode.addEventListener('click', function() {
		timer.toggle();
	});
	
	changeTimeNodes.forEach(node => {
		node.addEventListener('click', function() {
			var value = parseInt(this.getAttribute('data-value'), 10);

			timer.updateTime(value);
		});
	});

})();