const isEmpty = (value) => {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'object' && Object.keys(value).length === 0) ||
		(typeof value === 'string' && value.trim().length === 0)
	);
};


export const checkEmptyString = (str) => {
	if (typeof str === 'string' && str.trim().length === 0) {
		return true;
	}
	else {
		return false;
	}
}

export const checkValidEmail = (val) => {
	if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
		return true;
	}
	return false;
}

export const validateLoginInput = data => {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	if (!checkValidEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	if (checkEmptyString(data.email)) {
		errors.email = 'Email field is required';
	}

	if (checkEmptyString(data.password)) {
		errors.password = 'Password field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};