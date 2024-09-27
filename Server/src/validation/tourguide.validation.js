import Joi from "joi";

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  export const signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+/)
      .required()
      .messages({
        "string.pattern.base": "Password must contain at least one capital letter, one small letter, one special character, and one number.",
      }),
  }).unknown(true);
  