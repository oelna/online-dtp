var snapToGrid = false;
var gridSize = 25;

var ele;

document.querySelector('#grid-snap').addEventListener('change', function (event) {
	snapToGrid = this.checked;

	if (snapToGrid == true) {
		ele.draggable({
			'modifiers': [snap]
		});
	} else {
		ele.draggable({
			'modifiers': []
		});
	}
});

const snap = interact.modifiers.snap({
	targets: [interact.snappers.grid({ x: gridSize, y: gridSize })],
	relativePoints: [{ x: 0, y: 0 }],
});

ele = interact('.item').draggable({
	'modifiers': [], // [snap]
	'listeners': {
		move (event) {
			var target = event.target

			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		}
	}
});

document.querySelector('nav.panel').addEventListener('click', function (event) {
	const ele = event.target.tagName.toLowerCase();

	if (ele == 'summary') {
		if (event.target.parentNode.open == false) {
			const tabs = this.querySelectorAll('details');
			for (const tab of tabs) {
				tab.open = false;
			}
		} else {
			event.target.parentNode.open = false;
			event.preventDefault();
		}
	}
});

var app = {
	'adjustGrid': function (event, self) {
		const gridSize = parseFloat(self.value);
		document.querySelector('#workspace').style.setProperty('--grid-size', gridSize + 'mm');
	},
	'stepInput': function (event, self) {
		if (event.key == 'ArrowUp') {
			self.value = parseInt(self.value) + 1;
		} else {
			self.value = parseInt(self.value) - 1;
		}

		const func = self.getAttribute('data-function');
		app[func](event, self);
	},
	'selectItem': function (event, self) {
		const panel = document.querySelector('.panel .properties');

		const styles = window.getComputedStyle(self);
		panel.querySelector('input#item-width').value = parseInt(styles.getPropertyValue('--width'));
		panel.querySelector('input#item-height').value = parseInt(styles.getPropertyValue('--height'));
	},
	'adjustItemWidth': function (event, self) {
		document.querySelector('.item.selected').style.setProperty('--width', parseFloat(self.value) + 'mm');
	},
	'adjustItemHeight': function (event, self) {
		document.querySelector('.item.selected').style.setProperty('--height', parseFloat(self.value) + 'mm');
	},
};

document.querySelectorAll('.panel-input').forEach(function (ele, i) {
	['change', 'keyup'].forEach(function (event) {
		ele.addEventListener(event, function (e) {
			const func = this.getAttribute('data-function');
			app[func](e, this);
		});
	});

	ele.addEventListener('keyup', function (e) {
		if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
			app['stepInput'](e, this);
		}
	});
});

document.querySelector('#workspace').addEventListener('mouseup', function (e) {
	
	this.querySelectorAll('.item').forEach(function (ele, i) {
		ele.classList.remove('selected');
	});

	if (e.target.classList.contains('item')) {
		e.target.classList.add('selected');
		app.selectItem(e, e.target);
	}
});


