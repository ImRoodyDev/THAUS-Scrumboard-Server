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

function validateGroupName(name){
	const validator = Joi.object({
		name: Joi.string().alphanum().max(50).trim().required().label('GroupName').messages({
			'string.empty': `Uw groepsnaam kan niet leeg zijn. Voer een geldige groepsnaam in.`,
			'string.alphanum': `Uw groepsnaam mag alleen letters en cijfers bevatten.`,
			'any.required': `Het veld Groepsnaam is verplicht. Geef uw groepsnaam op.`,
		}),
	});

	const { error, value } = validator.validate({name});

	return [error, value.name];
}

function validateTextName(name){
	const validator = Joi.object({
		name: Joi.string().alphanum().max(50).trim().required().label('Name').messages({
			'string.empty': `Uw naam kan niet leeg zijn. Voer een geldige naam in.`,
			'string.alphanum': `Uw naam mag alleen letters en cijfers bevatten.`,
			'any.required': `Het veld Naam is verplicht. Geef uw naam op.`,
		}),
	});

	const { error, value } = validator.validate({name});

	return [error, value.name];
}

module.exports = {
	validateLogin,
	validateRegister,
	validateTextName,
	validateGroupName
};
