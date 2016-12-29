'use strict';

function setValue(options) {

	alert('$:', $);

	const selector = options.selector;
	const value = options.value;

	$(selector).val(value);
}

module.export = setValue;
