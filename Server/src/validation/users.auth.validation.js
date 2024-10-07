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
export const PasswordSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string()
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
  // Conditional validation for name and email based on user type
  username: Joi.string().required(),
  email: Joi.string().email().when("type", {
    is: "Admin",
    then: Joi.string().optional(), // Not required if type is admin
    otherwise: Joi.string().required(), // Required for other types
  }),
  type: Joi.string().valid("Tourist", "Tour Guide", "Admin", "Advertiser", "Seller", "Tourism Governor").required(),


    // Directly validate birthDate for Tourist type
    birthDate: Joi.date()
    .iso() // Ensure it's an ISO date format (YYYY-MM-DD)
    .max("now")
    .custom((value, helpers) => {
      const age = calculateAge(value);
      if (age < 18 || age >= 100) {
        return helpers.message("Your age must be between 18 and 100 years.");
      }
      return value;
    })
    .when("type", { is: "Tourist", then: Joi.required() })
    .messages({
      "date.base": "Invalid date format.",
      "date.max": "Birthdate must be in the past.",
    }),

  nationality: Joi.string().when("type", {
    is: "Tourist",
    then: Joi.required(),
  }),

  password: Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
  .required()
  .messages({
    "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
  }),
}).unknown(true);