'use strict';

function setValue($, options) {

	console.log('$ = ', $);

	const selector = options.selector;
	const value = options.value;

	$(selector).val(value);
}

module.export = setValue;
