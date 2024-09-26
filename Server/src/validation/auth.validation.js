const Joi = require("joi");

// Function to calculate age based on date of birth
function calculateAge(dateOfBirth) {
  const currentDate = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    return age - 1;
  }

  return age;
}

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
    }),
  dateOfBirth: Joi.date()
    .max('now')
    .custom((value, helpers) => {
      const age = calculateAge(value);
      if (age < 18 || age >= 100) {
        return helpers.message('Your age must be between 18 and 100 years ago.');
      }
      return value;
    })
    .required()
    .messages({
      "date.base": "Invalid date format.",
    }),
}).unknown(true);

module.exports = {
  signupSchema,
};
