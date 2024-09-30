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
  // Conditional validation for name and email based on user type
  name: Joi.string().when("type", {
    is: "admin",
    then: Joi.string().optional(), // Not required if type is admin
    otherwise: Joi.string().required(), // Required for other types
  }),
  username: Joi.string().required(),
  email: Joi.string().email().when("type", {
    is: "admin",
    then: Joi.string().optional(), // Not required if type is admin
    otherwise: Joi.string().required(), // Required for other types
  }),
  type: Joi.string().valid("tourist", "tourGuide", "admin", "advertiser", "seller", "touristGovernment").required(),

  details: Joi.object().when("type", {
    is: "tourist",
    then: Joi.object({
      nationality: Joi.string().required(),
      phoneNumber: Joi.string().required(),
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
    }),
    is: "tourGuide",
    then: Joi.object({
      licenseNumber: Joi.string().required(),
      experienceYears: Joi.number().min(1).required(),
      regionSpecialization: Joi.string().required(),
    }),
    is: "admin",
    then: Joi.object({
      adminLevel: Joi.string().required(),
      department: Joi.string().required(),
    }),
    is: "advertiser",
    then: Joi.object({
      companyName: Joi.string().required(),
      adBudget: Joi.number().min(1).required(),
    }),
    is: "seller",
    then: Joi.object({
      description: Joi.string().required(),
    }),
    is: "touristGovernment",
    then: Joi.object({
      department: Joi.string().required(),
    }),
    otherwise: Joi.object(), // Default case
  }),

  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
    }),
}).unknown(true);
