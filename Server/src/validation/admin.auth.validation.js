import Joi from "joi";

export const createschema = Joi.object({
    username: Joi
    .string()
    .required()
    .messages({
        "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, one number, and must be unique",
      }),
    password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
    }),
});
export const adminManipulateSchema = Joi.object({
  name: Joi.string()
  .required()
  .messages({
    "string.pattern.base": "Name must be unique and must not be empty",
  }),
});
export const adminUpdateSchema = Joi.object({
  oldName: Joi.string()
  .required()
  .messages({
    "string.pattern.base": "Name must be unique and must not be empty",
  }),
  newName: Joi.string() 
  .required()
  .messages({
    "string.pattern.base": "Name must be unique and must not be empty",
  }),
});