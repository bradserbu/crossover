'use strict';

/**
 * Load a URL in the specified browser window
 * @param window
 * @param options
 */
function open(window, options) {

	const url = options.url;

	window.loadURL(url);
}

module.export = open;
