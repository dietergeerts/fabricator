'use strict';

if (typeof require !== 'undefined') { require('./prism'); }

/**
 * Global `fabricator` object
 * @namespace
 */
var fabricator = window.fabricator = {};


/**
 * Default options
 * @type {Object}
 */
fabricator.options = {
	toggles: {
		labels: true,
		notes: true,
		code: false
	},
	menu: false,
	mq: '(min-width: 60em)'
};

// open menu by default if large screen
fabricator.options.menu = window.matchMedia(fabricator.options.mq).matches;

/**
 * Feature detection
 * @type {Object}
 */
fabricator.test = {};

// test for sessionStorage
fabricator.test.sessionStorage = (function () {
	var test = '_f';
	try {
		sessionStorage.setItem(test, test);
		sessionStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}
}());

// create storage object if it doesn't exist; store options
if (fabricator.test.sessionStorage) {
	sessionStorage.fabricator = sessionStorage.fabricator || JSON.stringify(fabricator.options);
}


/**
 * Cache DOM
 * @type {Object}
 */
fabricator.dom = {
	root: document.querySelector('html'),
	primaryMenu: document.querySelector('.f-menu'),
	menuItems: document.querySelectorAll('.f-menu li a'),
	menuToggle: document.querySelector('.f-menu-toggle')
};


/**
 * Get current option values from session storage
 * @return {Object}
 */
fabricator.getOptions = function () {
	return (fabricator.test.sessionStorage) ? JSON.parse(sessionStorage.fabricator) : fabricator.options;
};


/**
 * Build color chips
 */
fabricator.buildColorChips = function () {

	var chips = document.querySelectorAll('.f-color-chip'),
		color;

	for (var i = chips.length - 1; i >= 0; i--) {
		color = chips[i].querySelector('.f-color-chip__color').innerHTML;
		chips[i].style.borderTopColor = color;
		chips[i].style.borderBottomColor = color;
	}

	return this;

};


/**
 * Handler for preview and code toggles
 * @return {Object} fabricator
 */
fabricator.allItemsToggles = function () {

	var items = {
		labels: document.querySelectorAll('[data-f-toggle="labels"]'),
		notes: document.querySelectorAll('[data-f-toggle="notes"]'),
		code: document.querySelectorAll('[data-f-toggle="code"]')
	};

	var toggleAllControls = document.querySelectorAll('.f-controls [data-f-toggle-control]');

	var options = fabricator.getOptions();

	// toggle all
	var toggleAllItems = function (type, value) {

		var button = document.querySelector('.f-controls [data-f-toggle-control=' + type + ']'),
			_items = items[type];

		for (var i = 0; i < _items.length; i++) {
			if (value) {
				_items[i].className =  _items[i].className.replace(' f-item-hidden', '').replace('f-item-hidden', '');
			} else {
				_items[i].className = _items[i].className + ' f-item-hidden';
			}
		}

		// toggle styles
		if (value) {
			button.className = button.className + ' f-active';
		} else {
			button.className = button.className.replace(' f-active', '').replace('f-active', '');
		}

		// update options
		options.toggles[type] = value;

		if (fabricator.test.sessionStorage) {
			sessionStorage.setItem('fabricator', JSON.stringify(options));
		}

	};

	for (var i = 0; i < toggleAllControls.length; i++) {

		toggleAllControls[i].addEventListener('click', function (e) {

			// extract info from target node
			var type = e.currentTarget.getAttribute('data-f-toggle-control'),
				value = e.currentTarget.className.indexOf('f-active') < 0;

			// toggle the items
			toggleAllItems(type, value);

		});

	}

	// persist toggle options from page to page
	for (var toggle in options.toggles) {
		if (options.toggles.hasOwnProperty(toggle)) {
			toggleAllItems(toggle, options.toggles[toggle]);
		}
	}

	return this;

};


/**
 * Handler for single item code toggling
 */
fabricator.singleItemToggle = function () {

	var itemToggleSingle = document.querySelectorAll('.f-item-group [data-f-toggle-control]');

	// toggle single
	var toggleSingleItemCode = function (e) {
		var group = this.parentNode.parentNode.parentNode,
			type = e.currentTarget.getAttribute('data-f-toggle-control');

		if (group.querySelector('[data-f-toggle=' + type + ']').className.indexOf('f-item-hidden') > -1) {
			group.querySelector('[data-f-toggle=' + type + ']').className =
				group.querySelector('[data-f-toggle=' + type + ']').className
					.replace(' f-item-hidden', '').replace('f-item-hidden', '');
		} else {
			group.querySelector('[data-f-toggle=' + type + ']').className =
				group.querySelector('[data-f-toggle=' + type + ']').className + ' f-item-hidden';
		}
	};

	for (var i = 0; i < itemToggleSingle.length; i++) {
		itemToggleSingle[i].addEventListener('click', toggleSingleItemCode);
	}

	return this;

};


/**
 * Automatically select code when code block is clicked
 */
fabricator.bindCodeAutoSelect = function () {

	var codeBlocks = document.querySelectorAll('.f-item-code');

	var select = function (block) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(block.querySelector('code'));
		selection.removeAllRanges();
		selection.addRange(range);
	};

	for (var i = codeBlocks.length - 1; i >= 0; i--) {
		codeBlocks[i].addEventListener('click', select.bind(this, codeBlocks[i]));
	}

	return this;
};


/**
 * Open/Close menu based on session var.
 * Also attach a media query listener to close the menu when resizing to smaller screen.
 */
fabricator.setInitialMenuState = function () {

	// root element
	var root = document.querySelector('html');

	var mq = window.matchMedia(fabricator.options.mq);

	// if small screen
	var mediaChangeHandler = function (list) {
		if (!list.matches) {
			root.className = root.className.replace(' f-menu-active', '').replace('f-menu-active', '');
		} else {
			if (fabricator.getOptions().menu) {
				root.className = root.className + ' f-menu-active';
			} else {
				root.className = root.className.replace(' f-menu-active', '').replace('f-menu-active', '');
			}
		}
	};

	mq.addListener(mediaChangeHandler);
	mediaChangeHandler(mq);

	return this;

};


/**
 * Init the deep menu toggles.
 * @returns {Window.fabricator}
 */
fabricator.initDeepMenuToggles = function () {

	var deepMenus = document.querySelectorAll('.f-menu-toggle');

	for (var index = 0; index < deepMenus.length; index++) {
		deepMenus[index].addEventListener('click', toggleDeepMenu);
	}

	function toggleDeepMenu(event) {
		event.stopPropagation();
		var target = event.currentTarget;
		target.className = target.className + ' f-active';
		
		var closeDeepMenu = function (event) {
			target.className = target.className.replace(' f-active', '').replace('f-active', '');
			document.removeEventListener('click', closeDeepMenu);
		};
		
		document.addEventListener('click', closeDeepMenu);
	}

	return this;
};


/**
 * Initialization
 */
(function () {

	// invoke
	fabricator
		.setInitialMenuState()
		.allItemsToggles()
		.singleItemToggle()
		.buildColorChips()
		.bindCodeAutoSelect()
		.initDeepMenuToggles();
}());
