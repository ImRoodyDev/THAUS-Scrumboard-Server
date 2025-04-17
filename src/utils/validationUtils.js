const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

/** Password specifications */
const complexityOptions = {
	min: 7,
	max: 26,
	lowerCase: 0,
	upperCase: 0,
	numeric: 1,
	symbol: 0,
	requirementCount: 3, // At least 3 of the above rules must be satisfied
};

function validateLogin(data) {
	const validator = Joi.object({
		username: Joi.string().alphanum().trim().required().label('Username'),
		password: Joi.string().max(26),
	});

	const { error, value } = validator.validate(data);
	return [error, value];
}

/** Validate post body for registering account */
function validateRegister(postBody) {
	const validator = Joi.object({
		username: Joi.string().alphanum().trim().required().label('Username').messages({
			'string.empty': `Uw gebruikersnaam kan niet leeg zijn. Voer een geldige gebruikersnaam in.`,
			'string.alphanum': `Uw gebruikersnaam mag alleen letters en cijfers bevatten.`,
			'any.required': `Het veld Gebruikersnaam is verplicht. Geef uw gebruikersnaam op.`,
		}),

		password: passwordComplexity(complexityOptions).trim().required().label('Password').messages({
			'string.empty': `Uw wachtwoord kan niet leeg zijn. Voer een geldig wachtwoord in.`,
			'string.length': `Uw wachtwoord voldoet niet aan de vereiste complexiteit. Volg de aangegeven richtlijnen.`,
			'string.pattern': `Uw wachtwoord voldoet niet aan de vereiste complexiteit. Volg de aangegeven richtlijnen.`,
			'any.required': `Het veld Wachtwoord is verplicht. Geef een wachtwoord op.`,
		}),
	});

	const { error, value } = validator.validate(postBody);
	return [error, value];
}

function validateUsername(data) {
	const validator = Joi.object({
		username: Joi.string().alphanum().trim().required().label('Username').messages({
			'string.empty': `Uw gebruikersnaam kan niet leeg zijn. Voer een geldige gebruikersnaam in.`,
			'string.alphanum': `Uw gebruikersnaam mag alleen letters en cijfers bevatten.`,
			'any.required': `Het veld Gebruikersnaam is verplicht. Geef uw gebruikersnaam op.`,
		}),
	});

	const { error, value } = validator.validate(data);

	return [error, value];
}

function validatePassword(data) {
	const validator = Joi.object({
		password: passwordComplexity(complexityOptions).trim().required().label('Password').messages({
			'string.empty': `Uw wachtwoord kan niet leeg zijn. Voer een geldig wachtwoord in.`,
			'string.length': `Uw wachtwoord voldoet niet aan de vereiste complexiteit. Volg de aangegeven richtlijnen.`,
			'string.pattern': `Uw wachtwoord voldoet niet aan de vereiste complexiteit. Volg de aangegeven richtlijnen.`,
			'any.required': `Het veld Wachtwoord is verplicht. Geef een wachtwoord op.`,
		}),
	});

	const { error, value } = validator.validate(data);

	return [error, value];
}

module.exports = {
	validateLogin,
	validateRegister,
	validateUsername,
	validatePassword,
};
