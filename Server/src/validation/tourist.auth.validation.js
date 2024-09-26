import Joi from "joi";

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

export const changePasswordSchema = Joi.object({
  username: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
  .required()
  .messages({
    "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
  }),
});


export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const signupSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  nationality: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
    }),
  dateOfBirth: Joi.date()
    .max("now")
    .custom((value, helpers) => {
      const age = calculateAge(value);
      if (age < 18 || age >= 100) {
        return helpers.message("Your age must be greater than 18 years.");
      }
      return value;
    })
    .required()
    .messages({
      "date.base": "Invalid date format.",
    }),

  occupation: Joi.string().required().messages({
    "string.pattern.base": "You must enter your occupation",
  }),
}).unknown(true);
