// Source: https://stackoverflow.com/questions/13814621/how-can-i-get-the-dimensions-of-a-multidimensional-javascript-array

export function array_equals(a, b) {
	return a.length === b.length && a.every(function(value, index) {
		return value === b[index];
	});
}

export function getdim(arr) {
	if (/*!(arr instanceof Array) || */!arr.length) {
		return []; // current array has no dimension
	}
	let dim = arr.reduce(function(result, current) {
		// check each element of arr against the first element
		// to make sure it has the same dimensions
		return array_equals(result, getdim(current)) ? result : false;
	}, getdim(arr[0]));

	// dim is either false or an array
	return dim && [arr.length].concat(dim);
}

export function wrapIndex(index, arrayLength) {
	return (index + arrayLength) % arrayLength
}
