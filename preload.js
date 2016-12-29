'use strict';

const util = require('util');

function setValue(options) {

	const selector = options.selector;
	const value = options.value;

	$(selector).val(value);
}

function submit(options) {

	const form = options.form;

	alert($(form).name);

	$(form).trigger('submit');
}

function click(options) {

	const selector = options.selector;

	$(selector).trigger('click');
}

function attachHooks() {
	$(document).click(function (event) {
		alert("clicked: " + event.target);

		alert("id: " + $(event.target).attr('id'));
		alert("name: " + $(event.target).attr('name'));
		alert("href: " + $(event.target).attr('href'));
		alert("path: " + $(event.target).getPath());

		// return false;
	});
}

function extendJQuery() {
	/*
	 Get the Path to the object
	 */
	jQuery.fn.getPath = function () {
		if (this.length != 1) throw 'Requires one element.';

		var path, node = this;
		while (node.length) {
			var realNode = node[0], name = realNode.localName;
			if (!name) break;
			name = name.toLowerCase();

			var parent = node.parent();

			var siblings = parent.children(name);
			if (siblings.length > 1) {
				name += ':eq(' + siblings.index(realNode) + ')';
			}

			path = name + (path ? '>' + path : '');
			node = parent;
		}

		return path;
	};
}

function loadJQuery(next) {

	const jQuery = window.jQuery;

	alert('Looking for jquery...' + jQuery);

	if (util.isNullOrUndefined(jQuery)) {
		alert('Loading jQuery...');

		const script = document.createElement("script");
		script.src = "https://code.jquery.com/jquery-2.1.4.min.js";
		document.body.appendChild(script);

		// Call next() onload of the script
		script.onload = script.onreadystatechange = function () {
			alert('JQuery loaded');
			extendJQuery();
			next();
		};
	} else {
		alert('jQuery already loaded...');
		extendJQuery();
		next();
	}
}

/**
 * Inject JQuery script into page
 */
window.onload = function () {

	// ** Run a scripted action
	loadJQuery(function () {

		$(document).ready(function () {

			alert('Document Ready');
			attachHooks();

			// setValue({
			// 	selector: "#lst-ib",
			// 	value: "Hello, World"
			// });

			// alert('hello world');

			// click({
			// 	selector: '[name="btnK"]'
			// })

			// submit({
			// 	form: "#tsf"
			// });
		});
	});
};
