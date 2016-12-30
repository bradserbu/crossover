'use strict';

// ** Dependencies
const util = require('util');
const {ipcRenderer} = require('electron');

function alert() {};

function attachHooks() {
	$(document).click(function (event) {
		alert("clicked: " + event.target);

		alert("id: " + $(event.target).attr('id'));
		alert("name: " + $(event.target).attr('name'));
		alert("href: " + $(event.target).attr('href'));
		alert("path: " + $(event.target).getPath());

		// showDialog();
		ipcRenderer.sendToHost('new-action', {
			id: $(event.target).attr('id'),
			path: $(event.target).getPath()
		});
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
		script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
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

function showDialog() {
	const {BrowserWindow} = require('electron').remote;

	const dialog = new BrowserWindow();
	dialog.loadURL('file://' + __dirname + '/../new-action/index.html');
	dialog.focus();

	return dialog;
}

/**
 * Inject JQuery script into page
 */
window.onload = function () {

	// ** Run a scripted action
	loadJQuery(function () {
		$(document).ready(function () {

			alert('Document Ready...');
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
